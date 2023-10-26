import React from 'react';

import MuiTextField from '@mui/material/TextField';

import { FormFieldProps } from '../../../types/form';

const FileField = ({ form, field }: FormFieldProps) => {
    const {
        label, name,
        // eslint-disable-next-line no-unused-vars
        initialValue, gridItem,
        ...props
    } = field;

    const { fileFieldProps } = form;

    return (
        <MuiTextField
            fullWidth
            {...props}
            {...fileFieldProps(name, (e) => {
                const { files } = e.target;
                if (props.multiple || !files) {
                    return files;
                }
                return files[0];
            })}
            label={label || name}
            type="file"
        />
    );
};

export default FileField;