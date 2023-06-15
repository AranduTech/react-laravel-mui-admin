import React from 'react';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import FormField from './FormField';
import { UseFormTools } from '../../types/form';
import { ModelField } from '../../types/model';

export interface BaseFormProps {
    component?: React.ElementType;
    fieldWrapperComponent?: React.ElementType;
    submitText?: string;
    cancelText?: string;
    onCancel?: () => void;
    showCancelButton?: boolean;
    showSubmitButton?: boolean;
    alert?: string;
    alertSeverity?: 'error' | 'warning' | 'info' | 'success';
    as?: React.ElementType;
}

export interface FormProps extends BaseFormProps {
    form: UseFormTools;
    fields: ModelField[];
}

const Form = ({
    form, fields, component: Component = Grid, fieldWrapperComponent: FieldWrapperComponent = Grid,
    submitText = 'Submit', cancelText = 'Cancel', onCancel = () => null,
    showCancelButton = false, showSubmitButton = true, alert, alertSeverity = 'error',
    as = 'form',
    ...props
}: FormProps) => {
    const { formProps, errors } = form;

    const addedProps = React.useMemo(() => as === 'form'
        ? { ...formProps(), component: 'form' }
        : { component: as }, [as, formProps]);

    return (
        <Component
            {...addedProps}
            container
            {...props}
        >

            {fields.map((field) => (
                <FormField
                    key={field.name}
                    field={field}
                    wrapper={FieldWrapperComponent}
                    form={form}
                />
            ))}
            {errors.some((error) => error.key === 'submit') && (
                <FieldWrapperComponent xs={12}>
                    <Alert severity="error">
                        {errors.find((error) => error.key === 'submit')?.message}
                    </Alert>
                </FieldWrapperComponent>
            )}
            {alert && (
                <FieldWrapperComponent xs={12}>
                    <Alert severity={alertSeverity}>
                        {alert}
                    </Alert>
                </FieldWrapperComponent>
            )}
            <FieldWrapperComponent
                xs={12}
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                {showCancelButton && (
                    <Button
                        variant="outlined"
                        onClick={onCancel}
                        sx={{ mt: 1 }}
                    >
                        {cancelText}
                    </Button>
                )}
                {showSubmitButton && (
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 1 }}
                    >
                        {submitText}
                    </Button>
                )}
            </FieldWrapperComponent>
        </Component>

    );
};

export default Form;
