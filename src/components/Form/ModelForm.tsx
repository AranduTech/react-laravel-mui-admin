import React from 'react';
import PropTypes from 'prop-types';

// import Model from '../../contracts/Model';
import useForm from '../../useForm';
import modelRepository from '../../internals/singletons/ModelRepository';

import Form, { BaseFormProps, FormProps } from './Form';

import { useTranslation } from 'react-i18next';
import { Model } from '../../types/model';
import { AxiosResponse } from 'axios';
import { LaravelItemResponse } from '../../types/laravel';
import { FormFieldDefinition, FormState, UseFormOptions } from '../../types/form';
import route from '../../route';
import { RouteReplacer } from '../../types/route';
import useApplyFilters from '../../useApplyFilters';

const addMetaPropsToField = (item: Model, schema: string) => (field: FormFieldDefinition) => ({
    ...field,
    _meta: {
        model: item.className,
        schema,
    },
});

export interface BaseModelFormProps extends BaseFormProps {
    schema?: string;
    debug?: boolean;
    onSuccess?: (response: AxiosResponse<LaravelItemResponse>) => void;
    onChange?: (form: FormState) => void;
    onError?: (error: any) => void;
    onSubmit?: (form: FormState) => Promise<void>;
}

export interface ModelFormProps extends BaseModelFormProps {
    item: Model;
}

/**
 * Componente para renderizar um formulario de um modelo.
 *
 */
const ModelForm = ({
    item, schema = 'default', debug = false, onSuccess = () => null, onChange = () => null,
    onError = () => null, onSubmit,
    ...props
}: ModelFormProps) => {
    const fields = React.useMemo(
        () => modelRepository.getClassSchema(item.className).fields[schema],
        [item.className, schema],
    );

    const { t } = useTranslation();

    // const initialValues = React.useMemo(
    //     () => fields.reduce(
    //         (acc, field) => dotSetter(acc, field.name, item[field.name]),
    //         {},
    //     ),
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //     [],
    // );

    const routeParams: [string, RouteReplacer | undefined] = item.id
        ? [`admin.${item.className}.update`, { id: item.id }]
        : [`admin.${item.className}.create`, undefined];

    const formOptions = useApplyFilters(`model_form_options_${item.className}_${schema}`, {
        initialValues: item.json(),
        method: 'POST',
        action: route(...routeParams),
        onSuccess: (response: any) => {
            item.construct(response.data);
            onSuccess(response);
        },
        debug,
        onError,
        onSubmit,
        onChange,
        transformPayload: (payload: any) => ({
            ...payload,
            _type: schema,
        }),
        preventStructureChange: false,
    }, item);

    const form = useForm(formOptions);

    // console.log(item);

    return (
        <Form
            form={form}
            fields={fields.map(addMetaPropsToField(item, schema))}
            alert={item.deletedAt ? t('table.cantEditTrashed') as string : undefined}
            showSubmitButton={item.deletedAt === null}
            {...props}
        />
    );
};

ModelForm.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.number,
        json: PropTypes.func,
        save: PropTypes.func,
        // eslint-disable-next-line react/forbid-prop-types
        attributes: PropTypes.object,
        // eslint-disable-next-line react/forbid-prop-types
        original: PropTypes.object,
        createdAt: PropTypes.instanceOf(Date),
        deletedAt: PropTypes.instanceOf(Date),
        className: PropTypes.string,
        fill: PropTypes.func,
        diff: PropTypes.func,
        construct: PropTypes.func,

    }).isRequired,
    schema: PropTypes.string,
    debug: PropTypes.bool,
    onSuccess: PropTypes.func,
    onChange: PropTypes.func,
    onError: PropTypes.func,
    onSubmit: PropTypes.func,
};

export default ModelForm;
