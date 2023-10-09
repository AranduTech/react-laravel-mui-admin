import React from 'react';

import TextField from './FormField/TextField';
import CheckboxField from './FormField/CheckboxField';
import AutocompleteField from './FormField/AutocompleteField';
import LabelField from './FormField/LabelField';
import SelectField from './FormField/SelectField';
import { FormFieldProps } from '../../types/form';
import useApplyFilters from '../../useApplyFilters';

const fieldTypeMapping: { [key: string]: React.ElementType } = {
    select: SelectField,
    checkbox: CheckboxField,
    autocomplete: AutocompleteField,
    label: LabelField,
};

const FormField = ({ form, field, wrapper: WrapperComponent }: FormFieldProps & { wrapper: React.ElementType }) => {
    const { type = 'text', gridItem = { xs: 12 } } = field;

    const filteredFieldTypeMapping = useApplyFilters('form_field_type_mapping', fieldTypeMapping);

    const FormField = React.useMemo(() => {
        return filteredFieldTypeMapping[type] || TextField;
    }, [type]);

    return (
        <WrapperComponent {...gridItem}>
            <FormField
                form={form}
                field={field}
            />
        </WrapperComponent>
    );
};

export default FormField;
