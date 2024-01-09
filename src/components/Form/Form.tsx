import React from 'react';

import Alert from '@mui/material/Alert';
import Button, { ButtonPropsColorOverrides } from '@mui/material/Button';
import Grid, { Grid2Props } from '@mui/material/Unstable_Grid2';

import { OverridableStringUnion } from '@mui/types';

import FormField from './FormField';
import { FormFieldDefinition, UseFormTools } from '../../types/form';

type ButtonColor = OverridableStringUnion<
    'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
    ButtonPropsColorOverrides
>;

export interface BaseFormProps {
    component?: React.ElementType;
    fieldWrapperComponent?: React.ElementType;
    submitText?: string;
    cancelText?: string;
    onCancel?: () => void;
    showCancelButton?: boolean;
    showSubmitButton?: boolean;
    buttonProps?: React.ComponentProps<typeof Button>;
    submitButtonColor?: ButtonColor;
    cancelButtonColor?: ButtonColor;
    alert?: string;
    alertSeverity?: 'error' | 'warning' | 'info' | 'success';
    as?: React.ElementType;
    spacing?: Grid2Props['spacing'],
}

export interface FormProps extends BaseFormProps {
    form: UseFormTools;
    fields: FormFieldDefinition[];
}

const Form = ({
    form, fields, component: Component = Grid, fieldWrapperComponent: FieldWrapperComponent = Grid,
    submitText = 'Submit', cancelText = 'Cancel', onCancel = () => null,
    showCancelButton = false, showSubmitButton = true, alert, alertSeverity = 'error',
    as = 'form', submitButtonColor = 'primary', cancelButtonColor = 'error', buttonProps = {},
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
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}
            >
                {showCancelButton && (
                    <Button
                        {...buttonProps}
                        variant="outlined"
                        onClick={onCancel}
                        color={cancelButtonColor}
                    >
                        {cancelText}
                    </Button>
                )}
                {showSubmitButton && (
                    <Button
                        {...buttonProps}
                        type="submit"
                        variant="contained"
                        color={submitButtonColor}
                    >
                        {submitText}
                    </Button>
                )}
            </FieldWrapperComponent>
        </Component>

    );
};

export default Form;
