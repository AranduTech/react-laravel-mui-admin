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

function useTraceUpdate(props: any) {
    const prev = React.useRef(props);

    React.useEffect(() => {
        const changedProps = Object.entries(props).reduce((ps: any, [k, v]) => {
            if (prev.current[k] !== v) {
                ps[k] = [prev.current[k], v];
            }
            return ps;
        }, {});
        if (Object.keys(changedProps).length > 0) {
            console.log('Changed props:', changedProps);
        }
        prev.current = props;
    });
}

const FormField = (props: FormFieldProps & { wrapper: React.ElementType }) => {
    useTraceUpdate(props);

    const { form, field, wrapper: WrapperComponent } = props;

    const { type = 'text', gridItem = { xs: 12 } } = field;

    const filteredFieldTypeMapping = useApplyFilters('form_field_type_mapping', fieldTypeMapping);

    if (config('app.debug')) {
        if (!filteredFieldTypeMapping[type] && !['text', 'password', 'date', 'datetime-local', 'number'].includes(type)) {
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
            />
        </WrapperComponent>
    );
};

export default FormField;
