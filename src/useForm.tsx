import React from 'react';

import TextField, { TextFieldProps } from '@mui/material/TextField';
import { dotAccessor, dotExists, dotSetter } from './support/object';

import axios from 'axios';
import {
    AutocompletePropsCallback, AutocompletePropsOptions, CheckPropsCallback, FileFieldPropsCallback, FormError,
    FormPropsCallback, FormState, InputPropsCallback, SetPropCallback, TextFieldPropsCallback,
    UseFormOptions,
    UseFormTools
} from './types/form';
import { AutocompleteRenderInputParams, SelectChangeEvent } from '@mui/material';
import applyFilters from './applyFilters';

const checkIfValueIsValid: (value: any) => boolean = (value) => ['string', 'number', 'boolean'].includes(typeof value)
    || value === null
    // eslint-disable-next-line no-extra-parens
    || (Array.isArray(value) && value.every(checkIfValueIsValid))
    // eslint-disable-next-line no-extra-parens
    || (typeof value === 'object' && (
        // eslint-disable-next-line no-extra-parens
        (value instanceof Date || value instanceof File || value instanceof FileList)
        || Object.values(value).every(checkIfValueIsValid))
    );

interface AutocompleteGetProps { data: FormState, setProp: SetPropCallback, errors: FormError[], options: AutocompletePropsOptions }

const getAutocompleteProps = ({
    data, setProp, errors, options,
}: AutocompleteGetProps, key: string) => {
    const { textFieldProps = {}, ...rest } = options || {};

    return {
        name: key,
        value: dotAccessor(data, key),
        onChange: (_: any, value: any) => {
            setProp(key, value);
        },
        // isOptionEqualToValue: (option: any, value: any) => (option.value || option.id) === (value.value || value.id),
        renderInput: ({ InputLabelProps: { contentEditable, ...InputLabelProps }, ...params }: AutocompleteRenderInputParams) => (
            <TextField
                {...params}
                InputLabelProps={InputLabelProps}
                name={key}
                error={errors.some((error) => error.key === key)}
                helperText={errors.find((error) => error.key === key)?.message}
                {...textFieldProps}
            />
        ),
        ...rest,
    };
};

/**
 * Hook `useForm` para criar formulários com validação e controle de estado.
 *
 * @param options - Objeto de opções.
 * @param  options.initialValues - Valores iniciais do formulário.
 * > Note que o valor passado para este parâmetro é utilizado como estado inicial do formulário,
 * e portanto não deve ser alterado durante a execução do hook. Alterações no estado
 * do formulário devem ser feitas através da função `setProp` retornada pelo hook. Caso
 * o valor passado para este parâmetro seja alterado, o hook não será atualizado.
 * @param options.onSubmit - Função a ser executada ao submeter o formulário. Esta
 * função é executada antes da requisição HTTP, e recebe como parâmetro o estado atual do
 * formulário. Se esta função retornar `false`, a requisição HTTP não será executada.
 * @param options.onSuccess - Função a ser executada quando a requisição HTTP
 * for bem sucedida. Esta função recebe como parâmetro o retorno da requisição.
 * @param options.validate - Função de validação do formulário.
 * @param options.validateOnInputChange - Se verdadeiro, verifica os erros a cada input.
 * @param options.onChange - Função a ser executada a cada input do formulário.
 * @param options.debug - Se verdadeiro, exibe os informações no console.
 * @param options.onError - Função a ser executada quando houver um erro durante
 * a requisição HTTP. Esta função recebe como parâmetro o erro retornado pela requisição.
 * @param options.preventDefault - Se verdadeiro, previne o comportamento padrão.
 * Padrão: `true`.
 * @param options.action - URL para onde o formulário será enviado. Se não for
 * passado, o formulário não fará requisição HTTP e apenas executará a função `onSubmit`.
 * @param options.method - Método HTTP para envio do formulário. Padrão: `get`.
 * @param options.transformPayload - Função para transformar o payload antes
 * do envio da requisição HTTP.
 * @param options.preventStructureChange - Se verdadeiro, previne a alteração
 * da estrutura do objeto de estado do formulário. Padrão: `true`.
 * @param dependencies - Dependências do hook. Utilize este parâmetro caso
 * seu objeto de opções utilize dependências externas, para que as opções sejam
 * atualizadas quando as dependências mudarem.
 * @return - Objeto com as propriedades do formulário.
 * @throws - Se `initialValues` não for um objeto com strings,
 * números, booleans, null, Date, File, Array ou FileList.
 */
const useForm = (options: UseFormOptions = {}, dependencies: any[] = []): UseFormTools => {
    const {
        initialValues: initialValuesOption = {}, onSubmit: onSubmitFn = () => null,
        validate: validateFn = () => [], validateOnInputChange = false, preventDefault = true,
        onChange = () => null, debug = false, onError: onErrorFn = () => null,
        action, method = 'get', onSuccess: onSuccessFn = () => null,
        transformPayload: transformPayloadFn = (payload) => payload,
        preventStructureChange = false, formId,
    } = options;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const initialValues = React.useMemo(() => initialValuesOption, []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const validate = React.useCallback(validateFn, dependencies);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onError = React.useCallback(onErrorFn, dependencies);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onSubmit = React.useCallback(onSubmitFn, dependencies);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // const onChange = React.useCallback(onChangeFn, dependencies);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onSuccess = React.useCallback(onSuccessFn, dependencies);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const transformPayload = React.useCallback(transformPayloadFn, dependencies);

    const [data, setData] = React.useState(initialValues || {});
    const [errors, setErrors] = React.useState<FormError[]>([]);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const setProp: SetPropCallback = React.useCallback((key, value) => {
        // check if the target name is in the initialValues
        if (preventStructureChange && !dotExists(initialValues, key)) {
            if (debug) {
                // eslint-disable-next-line no-console
                console.debug(`[useForm] The name "${key}" is not`
                    + ' in the initialValues. setProp ignored.');
            }
            return;
        }

        if (!checkIfValueIsValid(value)) {
            if (debug) {
                // eslint-disable-next-line no-console
                console.debug(`[useForm] The value "${value}" for attribute`
                    + ` '${key}' is not a simple primitive, null, Array, Date or`
                    + ' File|FileList, or an object'
                    + ' with those types as values. `setProp` ignored.');
            }
            return;
        }

        setData((data) => {
            // const newData = structuredClone(data);

            const transfer = applyFilters(
                'use_form_clone_transfers',
                [],
                { formId, data, key, value }
            );

            if (debug) {
                if (transfer.length > 0) {
                    // eslint-disable-next-line no-console
                    console.debug(`[useForm] Transfered data for key ${key}`, transfer);
                }
            }
            
            const newData = structuredClone(data, { transfer });

            dotSetter(newData, key, value);

            if (validateOnInputChange) {
                setErrors(validate(newData));
            }

            const changeEvent = {
                key,
                value,
                previous: data,
                data: newData,
            };

            if (debug) {
                // eslint-disable-next-line no-console
                console.debug('[useForm] Form data updated', changeEvent);

            }
            onChange(changeEvent);
            return newData;
        });
    }, [preventStructureChange, initialValues, debug, validateOnInputChange, onChange, validate, formId]);

    const autocompleteProps: AutocompletePropsCallback<any> = React.useCallback(
        (key, options) => getAutocompleteProps({
            data, setProp, errors, options,
        }, key),
        [data, setProp, errors],
    );

    const textFieldProps: TextFieldPropsCallback = React.useCallback(
        (key, sanitizeFn = (e) => e.target.value) => ({
            name: key,
            value: dotAccessor(data, key) || '',
            onChange: (e) => {
                setProp(key, sanitizeFn(e));
            },
            error: errors.some((error) => error.key === key),
            helperText: errors.find((error) => error.key === key)?.message,
        }),
        [data, setProp, errors],
    );

    const selectFieldProps: TextFieldPropsCallback<SelectChangeEvent, string> = React.useCallback(
        (key, sanitizeFn = (e) => e.target.value) => ({
            name: key,
            value: dotAccessor(data, key) || '',
            onChange: (e) => {
                setProp(key, sanitizeFn(e));
            },
            error: errors.some((error) => error.key === key),
            helperText: errors.find((error) => error.key === key)?.message,
        }),
        [data, setProp, errors],
    );

    const fileFieldProps: FileFieldPropsCallback = React.useCallback(
        (key, sanitizeFn = (e) => e.target.files) => ({
            name: key,
            onChange: (e) => {
                setProp(key, sanitizeFn(e));
            },
            error: errors.some((error) => error.key === key),
            helperText: errors.find((error) => error.key === key)?.message
                || (() => {
                    const fileOrFiles = dotAccessor(data, key);
                    if (fileOrFiles instanceof FileList) {
                        return `${fileOrFiles.length} arquivo(s) selecionado(s)`;
                    }
                    if (fileOrFiles instanceof File) {
                        return fileOrFiles.name;
                    }
                    return '';
                })(),
        }),
        [setProp, errors, data],
    );

    const inputProps: InputPropsCallback<any> = React.useCallback(
        (key, sanitizeFn = (e) => e?.target?.value) => ({
            name: key,
            value: dotAccessor(data, key) || '',
            onChange: (e: any) => {
                setProp(key, sanitizeFn(e));
            },
        }),
        [data, setProp],
    );

    const checkProps: CheckPropsCallback = React.useCallback(
        (key, sanitizeFn = (e) => e.target.checked) => ({
            name: key,
            checked: dotAccessor(data, key) || false,
            onChange: (e) => {
                setProp(key, sanitizeFn(e));
            },
        }),
        [data, setProp],
    );

    const submit = React.useCallback(async (e: any) => {
        if (preventDefault) {
            e.preventDefault();
        }

        const errors = validate(data);
        setErrors(errors);
        if (errors.length > 0) {
            return;
        }

        try {
            setIsSubmitting(true);
            const submitted = await onSubmit(data, setErrors);

            if (false !== submitted && action) {
                const response = await axios({
                    method,
                    url: action,
                    data: transformPayload(data),
                });

                onSuccess(response);
            }
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(Object.keys(error.response.data.errors).map((errorKey) => ({
                    key: errorKey,
                    message: error.response.data.errors[errorKey].join(', '),
                })));
            }
            onError(error);
        } finally {
            setIsSubmitting(false);
        }
    }, [
        preventDefault,
        validate,
        data,
        onSubmit,
        action,
        method,
        onSuccess,
        onError,
        transformPayload,
    ]);

    const formProps: FormPropsCallback = React.useCallback(
        () => ({
            onSubmit: submit,
        }),
        [submit]
    );

        // check if every value in `initialValues` is a simple primitive,
    // null, `Array`, `Date` or `File`|`FileList`
    const isInitialValuesValid = Object.values(initialValues)
        .every(checkIfValueIsValid);

    if (!isInitialValuesValid) {
        // find error keys and values
        const errorKeys = Object.entries(initialValues)
            // eslint-disable-next-line no-unused-vars
            .filter(([_, value]) => !checkIfValueIsValid(value))
            .map(([key]) => key);
        const errorValues = Object.entries(initialValues)
            // eslint-disable-next-line no-unused-vars
            .filter(([_, value]) => !checkIfValueIsValid(value))
            // eslint-disable-next-line no-unused-vars
            .map(([_, value]) => value);

        if (debug) {
            // eslint-disable-next-line no-console
            console.debug(
                '[useForm] The following values are not'
                + ' simple primitives, null, Array, Date or File|FileList, or an object'
                + ' with those types as values:',
                errorKeys,
                errorValues,
            );
        }

        throw new Error('`initialValues` must be an object with strings, '
            + 'numbers, booleans, null, Date, File, Array or FileList, or an object'
            + ` with those types as values. Check the keys: ${errorKeys.map((key) => `"${key}"`).join(', ')}.`);
    }

    return {
        state: [
            data,
            setData,
        ],
        errors,
        inputProps,
        formProps,
        checkProps,
        textFieldProps,
        fileFieldProps,
        selectFieldProps,
        autocompleteProps,
        setProp,
        submit,
        isSubmitting,
    };
};

export default useForm;
