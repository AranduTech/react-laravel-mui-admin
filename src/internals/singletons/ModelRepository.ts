/* eslint-disable i18next/no-literal-string */
// import React from 'react';
// import Suspense from '../components/Suspense';
import makeBaseModel from '../makeBaseModel';
import { dotSetter } from '../../support/object';
import blade from '../../blade';
import route from '../../route';
import { RouteRegistrationMixins } from '../../types/route';
import { Model, ModelConstructorAttributes, ModelField, ModelSchema } from '../../types/model';
import { RouteObject } from 'react-router-dom';
import { ReactNode } from 'react';
import { BaseModel } from '../BaseModel';

/**
 * @typedef {object} RegistrationMixins
 * @property {Function} [className] - Função para lidar com ações para uma classe específica.
 */

/**
 * Class ModelRepository.
 */
export class ModelRepository {

    #schema: ModelSchema;

    #baseModels: { [className: string]: typeof Model } = {};

    #models: { [className: string]: typeof Model } = {};

    // #importMapping = {
    //     index: '../views/Repository/RepositoryIndex',
    //     // create: 'RepositoryItem',
    //     // item: 'RepositoryItem',
    // };

    /**
     * Cria uma nova instância de ModelRepository.
     */
    constructor() {
        this.#schema = blade('model-schema');

        if (this.#schema) {
            this.#makeClasses();
        }
    }

    createWebRoutes(registrationMixins: RouteRegistrationMixins = {}) {
        if (!this.#schema) {
            return [];
        }

        const routes: Array<RouteObject> = [];

        const { ['*']: every, ...mixins } = registrationMixins;

        Object.keys(this.#schema).forEach((className) => {
            const { web } = this.#schema[className];

            web.forEach((action) => {
                const defaultLoader = () => ({ className, action });

                if (className in mixins) {
                    const render = mixins[className](action, className);

                    if (!render) {
                        return;
                    }

                    if (typeof render === 'object' && 'element' in render) {
                        routes.push({
                            path: route(`admin.${className}.${action}`),
                            loader: render.loader || defaultLoader,
                            element: render.element,
                        });
                        return;
                    }

                    routes.push({
                        path: route(`admin.${className}.${action}`),
                        loader: defaultLoader,
                        element: render as ReactNode,
                    });
                    return;
                }
                if (every) {
                    const render = every(action, className);

                    if (!render) {
                        return;
                    }

                    if (typeof render === 'object' && 'element' in render) {
                        routes.push({
                            path: route(`admin.${className}.${action}`),
                            loader: render.loader || defaultLoader,
                            element: render.element,
                        });
                        return;
                    }

                    routes.push({
                        path: route(`admin.${className}.${action}`),
                        loader: defaultLoader,
                        element: every(action, className) as ReactNode,
                    });
                }
            });
        });

        return routes;
    }

    getClassSchema = (className: string) => {
        if (!this.#schema[className]) {
            throw new Error(`Schema for class '${className}' not found.`);
        }
        const { [className]: schema } = this.#schema;
        return schema;
    };

    /**
     * Obtém a classe base de um modelo.
     *
     * @param {string} className - Nome do modelo.
     * @return {ModelTypes.BaseModelConstructor} - Classe base do modelo.
     */
    #makeBaseModel(className: string) {
        if (!this.#baseModels[className]) {
            this.#baseModels[className] = makeBaseModel({ modelRepository: this, className }) as any;
        }
        return this.#baseModels[className];
    }

    /**
     * Cria uma nova instância de Model, utilizando `Proxy` para acesso fluente aos atributos.
     *
     * @param {string} className - Nome da classe em snake case. Ex: 'user'.
     * @return {ModelTypes.ProxyModelConstructor} - Instância de Model.
     */
    #makeModelClass(className: string) {
        const BaseModel = this.#makeBaseModel(className);

        return class Model extends BaseModel {

            /**
             * Cria uma nova instância de Model, utilizando Proxy para acesso fluente aos atributos.
             *
             * @param {object} attributes - Atributos do modelo.
             */
            constructor(attributes: ModelConstructorAttributes) {
                super(attributes);

                return new Proxy(this, {
                    get: (target: Model, prop: string) => {
                        if (prop in target) {
                            if (typeof target[prop] === 'function') {
                                return target[prop].bind(target);
                            }
                            return target[prop];
                        }
                        if (target.fillable.includes(prop)) {
                            return target.attributes[prop];
                        }
                        if (Object.keys(target.relations).includes(prop)) {
                            return target.relations[prop];
                        }
                        if (typeof target[prop] === 'function') {
                            return target[prop].bind(target);
                        }
                        return target[prop];
                    },
                    set: (target, prop: string, value) => {
                        if (target.fillable.includes(prop)) {
                            target.setAttribute(prop, value);
                            return true;
                        }
                        return true;
                    },
                });
            }

        };
    }

    /**
     * Cria as classes de modelo.
     *
     * @return {void}
     */
    #makeClasses() {
        Object.keys(this.#schema).forEach((className) => {
            this.#models[className] = this.#makeModelClass(className);
        });
    }

    /**
     * Registra classes de modelo.
     * Utilizado para substituir classes de modelo por outras.
     *
     * @param {object} substitutions - Objeto com as substituições.
     * @return {void}
     */
    registerModelClasses(substitutions: { [className: string]: any } = {}) {
        Object.keys(substitutions).forEach((className) => {
            this.#models[className] = substitutions[className];
        });
    }

    /**
     * Obtém a classe de um modelo.
     *
     * @param {string} className - Nome da classe em snake case. Ex: 'user'.
     * @return {ModelProxy} - Classe do modelo.
     * @throws {Error} - Caso a classe não exista.
     */
    getModelClass(className: string) {
        if (!this.#models[className]) {
            throw new Error(`Model class '${className}' not found.`);
        }
        return this.#models[className];
    }

    /**
     * Obtém as classes de modelo.
     *
     * @return {object} - Objeto com as classes de modelo.
     */
    getModels() {
        return this.#models;
    }

    /**
     * Cria uma instância de um modelo novo.
     *
     * @param {*} className - Nome da classe em snake case. Ex: 'user'.
     * @param {*} schema - Nome do schema. Padrão: 'default'.
     * @return {ModelTypes.ProxyModel} - Instância do modelo.
     */
    createEmptyModelInstance(className: string, schema = 'default') {
        // console.log('creating instance ....');

        const createClassInitialValues = (fields: ModelField[]) => fields
            .reduce((obj, field) => {
                if (field.initialValue !== undefined) {
                    return dotSetter(obj, field.name, field.initialValue);
                }
                return obj;
            }, {});

        const Model = this.getModelClass(className);
        const { fields: { [schema]: schemaFields } } = this.getClassSchema(className);

        console.log('will create initialValues', schemaFields);

        const initialValues: ModelConstructorAttributes = createClassInitialValues(schemaFields);

        console.log('got initial values', initialValues);

        return new Model(initialValues);
    }

}

const modelRepository = new ModelRepository();

export default modelRepository;

