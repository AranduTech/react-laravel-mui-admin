import React from 'react';

import InputLabel from '@mui/material/InputLabel';
import { FormFieldProps } from '../../../types/form';

const LabelField = ({ field }: FormFieldProps) => {
    const {
        label, name,
        // eslint-disable-next-line no-unused-vars
        initialValue, gridItem,
        ...props
    } = field;

    return (
        <InputLabel
            id={`input-label-${name}`}
            sx={{ px: 1 }}
            {...props}
        >
            {label}
        </InputLabel>
    );
};

export default LabelField;
