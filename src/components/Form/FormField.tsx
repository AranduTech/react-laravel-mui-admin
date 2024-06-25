import React from 'react';

import TextField from './FormField/TextField';
import CheckboxField from './FormField/CheckboxField';
import AutocompleteField from './FormField/AutocompleteField';
import LabelField from './FormField/LabelField';
import SelectField from './FormField/SelectField';
import { FormFieldProps } from '../../types/form';
import useApplyFilters from '../../useApplyFilters';
import FileField from './FormField/FileField';
import config from '../../config';
import macros from '../../internals/singletons/MacroService';

const fieldTypeMapping: { [key: string]: React.ElementType } = {
    select: SelectField,
    checkbox: CheckboxField,
    autocomplete: AutocompleteField,
    label: LabelField,
    file: FileField,
};

const FormField = ({ form, field, wrapper: WrapperComponent }: FormFieldProps & { wrapper: React.ElementType }) => {
    const { 
        type = 'text', 
        gridItem = { xs: 12 }, 
        slotProps = {}, 
    } = field;

    const filteredFieldTypeMapping = useApplyFilters('form_field_type_mapping', fieldTypeMapping);

    if (config('app.debug')) {
        if (!filteredFieldTypeMapping[type] && !['text', 'password', 'date', 'datetime-local'].includes(type)) {
            console.warn(`Field type "${type}" is not supported, falling back to "text"`);
            console.warn(`Supported types are: ${Object.keys(filteredFieldTypeMapping).join(', ')}`);
            console.warn(`There are currently ${macros.getFilters('form_field_type_mapping').length} filters for "form_field_type_mapping"`);
        }
    }

    const RenderedField = React.useMemo(() => {
        return filteredFieldTypeMapping[type] || TextField;
    }, [type]);

    return (
        <WrapperComponent {...gridItem}>
            <RenderedField
                form={form}
                field={field}
                inputProps={{
                    ...slotProps, 
                }}
            />
        </WrapperComponent>
    );
};

export default FormField;
