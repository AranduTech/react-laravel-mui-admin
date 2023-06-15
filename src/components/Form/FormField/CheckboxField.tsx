import React from 'react';

import Checkbox from '@mui/material/Checkbox';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';

import { FormFieldProps } from '../../../types/form';

const CheckboxField = ({ form, field }: FormFieldProps) => {
    const {
        label, name,
        // eslint-disable-next-line no-unused-vars
        initialValue, gridItem,
        ...props
    } = field;

    const { checkProps, errors } = form;

    return (
        <>
            <FormControlLabel
                control={(
                    <Checkbox
                        {...checkProps(name)}
                    />
                )}
                label={label || name}
                {...props}
            />
            {errors.some((error) => error.key === name) && (
                <FormHelperText error >
                    {errors.find((error) => error.key === name)?.message}
                </FormHelperText>
            )}
        </>
    );
};

export default CheckboxField;

