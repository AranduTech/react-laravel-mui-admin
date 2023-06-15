import React from 'react';

import MuiTextField from '@mui/material/TextField';

import { FormFieldProps } from '../../../types/form';

const TextField = ({ form, field }: FormFieldProps) => {
    const {
        label, type = 'text', name,
        // eslint-disable-next-line no-unused-vars
        initialValue, gridItem,
        ...props
    } = field;

    const { textFieldProps } = form;

    return (
        <MuiTextField
            fullWidth
            {...props}
            {...textFieldProps(name)}
            label={label || name}
            type={type}
        />
    );
};

export default TextField;
