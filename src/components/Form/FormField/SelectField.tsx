import React from 'react';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { FormFieldProps } from '../../../types/form';


const SelectField = ({ form, field }: FormFieldProps) => {
    const {
        label, name, options = [],
        // eslint-disable-next-line no-unused-vars
        initialValue, gridItem,
        ...props
    } = field;

    const { selectFieldProps: textFieldProps } = form;

    const { helperText, ...selectProps } = textFieldProps(name);

    return (
        <FormControl fullWidth>
            <InputLabel id={`input-label-${name}`}>{label}</InputLabel>
            <Select
                fullWidth
                {...props}
                {...selectProps}
                label={label || name}
                labelId={`input-label-${name}`}
            >
                {options.map((option) => (
                    <MenuItem
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </MenuItem>))}
            </Select>
            {selectProps.error && (
                <FormHelperText error>
                    {helperText}
                </FormHelperText>
            )}
        </FormControl>
    );
};

export default SelectField;
