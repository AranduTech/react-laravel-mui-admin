import React from 'react';
import { createObjectWithKeys, createObjectWithoutKeys, objectDiff } from '../support/object';
// import toast from '../services/toast';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { ModelAttributes, ModelConstructorAttributes, ModelSaveOptions, ModelUseDataOptions } from '../types/model';
import route from '../route';
import { ModelRepository } from './singletons/ModelRepository';

export class BaseModel {

    #attributes: ModelAttributes = {};
    #id: number = 0;
    #key?: string;
    #fillable: string[] = [];
    #original?: object;
    #relations: { [relationName: string]: BaseModel | BaseModel[] } = {};
    #createdAt: Date | null = null;
    #updatedAt: Date | null = null;
    #deletedAt: Date | null = null;


    /**
     * Cria uma nova instância de Model.
     *
     * @param {object} attributes - Atributos do modelo.
     */
    constructor(
        public readonly modelRepository: ModelRepository,
        public readonly className: string,
        attributes: ModelConstructorAttributes = { id: 0 }
    ) {
        this.construct(attributes);
    }


    /**
     * Atualiza os dados do modelo após salvar.
     *
     * @param attributes - Atributos do modelo.
     */
    construct(attributes: ModelConstructorAttributes) {


        this.#key = uuid();

        const { fillable, relations } = this.modelRepository.getClassSchema(this.className);

        const excludedKeys = [
            'id', 'created_at', 'updated_at', 'deleted_at', 'created_by',
            'updated_by', ...Object.keys(relations || {})
        ];

        const newAttributes = createObjectWithoutKeys(excludedKeys, attributes);

        const {
            id = 0, created_at: createdAt, updated_at: updatedAt,
            deleted_at: deletedAt,
        } = attributes;

        fillable.forEach((key) => {
            if (newAttributes[key] === undefined) {
                newAttributes[key] = null;
            }
        });

        this.#attributes = newAttributes;

        const newRelations: any = {};

        if (relations) {
            Object.entries(relations).forEach(([key, relation]) => {
                const { type, model } = relation;

                if (type === 'MorphTo' && !attributes[`${key}_type`]) {
                    return;
                }

                const Model = this.modelRepository.getModelClass(
                    type === 'MorphTo'
                        ? attributes[`${key}_type`] as string
                        : model
                );

                const relationData = attributes[key];
                const isSingle = ['BelongsTo', 'MorphOne', 'MorphTo'].includes(type);

                if (isSingle && typeof relationData === 'object' && relationData !== null) {
                    newRelations[key] = new Model(relationData as ModelConstructorAttributes);
                }

                if (!isSingle && Array.isArray(attributes[key])) {
                    newRelations[key] = (attributes[key] as object[]).map((item) => new Model(item as ModelConstructorAttributes));
                }
            });
        }

        this.#relations = newRelations;

        this.#original = { ...this.#attributes };
        this.#id = id;
        this.#fillable = fillable;

        this.#createdAt = createdAt
            ? new Date(createdAt)
            : null;

        this.#updatedAt = updatedAt
            ? new Date(updatedAt)
            : null;

        this.#deletedAt = deletedAt
            ? new Date(deletedAt)
            : null;
    }

    /**
     * Retorna o ID do modelo.
     *
     * @return {number} - ID do modelo.
     */
    get id() {
        return this.#id;
    }

    /**
     * Retorna os atributos do modelo.
     *
     * @return {object} - Atributos do modelo.
     */
    get attributes() {
        return this.#attributes;
    }

    /**
     * Retorna os atributos originais do modelo.
     *
     * @return {object} - Atributos originais do modelo.
     */
    get original() {
        return this.#original;
    }

    /**
     * Retorna os atributos preenchíveis do modelo.
     *
     * @return {string[]} - Atributos preenchíveis do modelo.
     */
    get fillable() {
        return this.#fillable;
    }

    /**
     * Retorna as relações do modelo.
     *
     * @return {object} - Relações do modelo.
     */
    get relations() {
        return this.#relations;
    }

    /**
     * Retorna a data de criação do modelo.
     *
     * @return {Date|null} - Data de criação do modelo.
     */
    get createdAt() {
        return this.#createdAt;
    }

    /**
     * Retorna a data de atualização do modelo.
     *
     * @return {Date|null} - Data de atualização do modelo.
     */
    get updatedAt() {
        return this.#updatedAt;
    }

    /**
     * Retorna a data de exclusão do modelo.
     *
     * @return {Date|null} - Data de exclusão do modelo.
     */
    get deletedAt() {
        return this.#deletedAt;
    }


    /**
     * Modifica o valor de um atributo do modelo.
     *
     * @param {string} key - Nome do atributo.
     * @param {any} value - Valor do atributo.
     * @return {boolean} - True caso o atributo tenha sido modificado.
     */
    setAttribute(key: string, value: any) {
        if (!this.fillable.includes(key)) {
            return false;
        }
        const newAttributes = structuredClone(this.attributes);
        newAttributes[key] = value;
        this.#attributes = newAttributes;
        return true;
    }

    /**
     * Modifica o valor de vários atributos do modelo.
     *
     * @param {object} attributes - Os atributos a serem modificados.
     */
    fill(attributes: object) {
        // console.log('fill started');
        const validAttributes = createObjectWithKeys(this.fillable, attributes);
        Object.keys(validAttributes).forEach((key) => {
            this.setAttribute(key, validAttributes[key]);
        });
    }

    /**
     * Retorna os dados do objeto como um objeto plano.
     *
     * @return {object} - Objeto plano com os dados do objeto.
     */
    json() {
        const modelRelations = this.modelRepository.getClassSchema(this.className).relations;

        const relations: any = Object.entries(this.relations).reduce((acc: any, [key, value]) => {
            const { type } = modelRelations[key];
            if (['BelongsTo', 'MorphOne', 'MorphTo'].includes(type) && value instanceof BaseModel) {
                acc[key] = value.json();
            }
            if (['HasMany', 'BelongsToMany', 'MorphMany', 'MorphToMany'].includes(type) && Array.isArray(value)) {
                acc[key] = value.map((item) => item.json());
            }
            return acc;
        }, {});

        return {
            id: this.id,
            ...this.attributes,
            ...relations,
            // eslint-disable-next-line camelcase
            created_at: this.createdAt,
            // eslint-disable-next-line camelcase
            updated_at: this.updatedAt,
            _key: this.key(),
        };
    }

    /**
     * Obtém os campos que foram modificados ou false caso nenhum
     * campo tenha sido modificado.
     *
     * @return {object|boolean} - Objeto com os campos modificados ou
     * false caso nenhum campo tenha sido modificado.
     */
    diff() {
        return objectDiff(this.original, this.attributes);
    }

    /**
     * Salva o modelo.
     *
     * @param {object} options - Opções de salvamento.
     * @param {object} options.additionalPayload - Objeto com dados adicionais
     * a serem enviados.
     * @param {boolean} options.sendsOnlyModifiedFields - Define se apenas os campos
     * modificados serão enviados.
     * @param {boolean} options.silent - Se verdadeiro desabilita o toast de erro/sucesso.
     * Padrão `false`.
     * @return {Promise} - Promise com o resultado da requisição.
     */
    save(options: ModelSaveOptions = {}) {
        const {
            additionalPayload = {},
            sendsOnlyModifiedFields = true,
            silent = false,
        } = options;

        const url = route(`admin.${this.className}.${this.id === 0 ? 'create' : 'update'}`, this.id === 0
            ? false
            : { id: this.id });



        return new Promise((resolve) => {
            if (!url) {
                resolve(false);
                return;
            }
            axios({
                url,
                method: 'POST',
                data: {
                    ...sendsOnlyModifiedFields
                        ? this.diff()
                        : createObjectWithKeys(this.fillable, this.attributes),
                    ...additionalPayload,
                },
            })
                .then((response) => {
                    if (response.status === 200) {
                        if (!silent) {
                            // toast.success(t());
                        }
                        this.construct(response.data);
                        resolve(true);
                        return;
                    }
                    resolve(false);
                })
                .catch((error) => {
                    console.error(error);

                    if (!silent && error.response?.status === 422) {
                        const errors = Object.keys(error.response.data.errors);

                        let errorMessage = error.response.data.message;
                        errors.forEach((errorKey) => {
                            errorMessage += `\n ${errorKey}: ${error.response
                                .data.errors[errorKey]}`;
                        });
                        // toast.error(errorMessage);
                        resolve(false);
                        return;
                    }
                    if (!silent) {
                        // toast.error(error.message);
                    }

                    resolve(false);
                });
        });
    }

    /**
     * Apaga o modelo.
     *
     * @return {Promise<boolean>} - Promise com o resultado da requisição.
     */
    delete() {
        const url = route(`admin.${this.className}.delete`, { id: this.id });

        return new Promise((resolve) => {
            if (!url) {
                resolve(false);
                return;
            }
            axios({
                url,
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.status === 200) {
                        resolve(true);
                        return;
                    }
                    resolve(false);
                })
                .catch((error) => {
                    console.error(error);
                    resolve(false);
                });
        });
    }

    /**
     * Apaga forçadamente o modelo.
     *
     * @return {Promise<boolean>} - Promise com o resultado da requisição.
     */
    forceDelete() {
        const url = route(`admin.${this.className}.forceDelete`, { id: this.id });

        return new Promise((resolve) => {
            if (!url) {
                resolve(false);
                return;
            }

            axios({
                url,
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.status === 200) {
                        resolve(true);
                        return;
                    }
                    resolve(false);
                })
                .catch((error) => {
                    console.error(error);
                    resolve(false);
                });
        });
    }

    /**
     * Restaura o modelo.
     *
     * @return {Promise<boolean>} - Promise com o resultado da requisição.
     * @throws {Error} - Caso o modelo não tenha sido apagado.
     */
    restore() {
        if (!this.deletedAt) {
            throw new Error('O modelo não foi apagado.');
        }

        const url = route(`admin.${this.className}.restore`, { id: this.id });
        return new Promise((resolve) => {

            if (!url) {
                resolve(false);
                return;
            }
            axios({
                url,
                method: 'POST',
            })
                .then((response) => {
                    if (response.status === 200) {
                        resolve(true);
                        return;
                    }
                    resolve(false);
                })
                .catch((error) => {
                    console.error(error);
                    resolve(false);
                });
        });
    }

    /**
     * Hook para manipular as informações da model em um state.
     *
     * @param {object} options - Opções.
     * @param {boolean} options.autoSave - Salvar automaticamente as alterações.
     * @return {Array} - Array com o usuário e a função para alterar propriedades.
     */
    useData(options: ModelUseDataOptions = {}) {
        const { autoSave = false } = options;

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [data, setData] = React.useState(this.attributes);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const setAttribute = React.useCallback((prop: string, value: any) => {
            const setted = this.setAttribute(prop, value);
            if (!setted) {
                return;
            }
            setData((attributes) => {
                const newAttributes = structuredClone(attributes);
                newAttributes[prop] = value;
                return newAttributes;
            });
            if (autoSave) {
                this.save({ silent: true });
            }
        }, [autoSave]);

        return [data, setAttribute];
    }

    /**
     * Retorna uma chave aleatória para a instância.
     *
     * @return {string} - Chave aleatória.
     */
    key() {
        return this.#key;
    }

    /**
     * Retorna 'true' caso o arquivo tenha sido exportado com sucesso.
     * 
     * @param searchParams - Parâmetros de busca
     * @param className - Nome da classe
     * @returns - Promise com o resultado da requisição.
     */
    static export(searchParams: any, className: String) {
        const url = route(`admin.${className}.export`, { searchParams });

        return new Promise((resolve) => {
            if (!url) {
                resolve(false);
                return;
            }

            axios({
                url,
                method: 'POST',
            })
                .then((response) => {
                    if (response.status === 200) {
                        resolve(true);
                        return;
                    }
                    resolve(false);
                })
                .catch((error) => {
                    console.error(error);
                    resolve(false);
                });
        });
    }

};

