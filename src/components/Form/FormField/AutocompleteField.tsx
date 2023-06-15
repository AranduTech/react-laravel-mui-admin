import React from 'react';

import Autocomplete from '@mui/material/Autocomplete';

import { dotAccessor, dotExists } from '../../../support/object';

import axios, { AxiosResponse } from 'axios';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { FormFieldProps } from '../../../types/form';
import route from '../../../route';
import { LaravelPaginatedResponse } from '../../../types/laravel';

const AutocompleteField = ({ form, field }: FormFieldProps) => {
    const {
        label, name, labeledBy = 'name', options: initialOptions, list,
        cached = true, debounce = 1000, _meta: { model, schema } = {},
        // eslint-disable-next-line no-unused-vars
        initialValue, gridItem, rows,
        ...props
    } = field;

    const { autocompleteProps: autocompletePropsFn } = form;

    const autocompleteProps = React.useMemo(
        () => autocompletePropsFn(name, { textFieldProps: { label: label || name } }),
        [autocompletePropsFn, label, name],
    );

    const [loading, setLoading] = React.useState(false);
    const [options, setOptions] = React.useState(initialOptions || []);
    const [inputText, setInputText] = React.useState('');

    const { t } = useTranslation();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const throttledRequest = React.useCallback(_.throttle((list, inputText, name, cached, model, schema) => {
        const handleRequestResponse = (response: AxiosResponse<LaravelPaginatedResponse>) => {
            if (cached) {
                setOptions((options) => [
                    ...options,
                    ...response.data.data.filter((option) => !options.some((o) => o.id === option.id)),
                ]);
                return;
            }
            setOptions(response.data.data);
        };

        if (typeof list !== 'undefined') {
            setLoading(true);
            if (typeof list === 'string' && route.exists(`${list}.list`)) {
                axios(`${route(`${list}.list`)}?q=${inputText}&per_page=30`)
                    .then(handleRequestResponse)
                    .finally(() => setLoading(false));
                return;
            }
            axios(`${route('admin.autocomplete')}?q=${inputText}&name=${name}&model=${model}&schema=${schema}`)
                .then(handleRequestResponse)
                .finally(() => setLoading(false));
        }
    }, debounce), []);

    React.useEffect(() => {
        throttledRequest(list, inputText, name, cached, model, schema);
    }, [list, inputText, name, cached, model, schema, throttledRequest]);

    return (
        <Autocomplete
            fullWidth
            {...props}
            {...autocompleteProps}
            getOptionLabel={(option) => dotExists(option, labeledBy)
                ? dotAccessor(option, labeledBy)
                : JSON.stringify(option)}
            onInputChange={(event, newInputValue) => setInputText(newInputValue)}
            inputValue={inputText}
            options={options}
            loading={loading}
            loadingText={t('loading')}
        />
    );
};

export default AutocompleteField;
