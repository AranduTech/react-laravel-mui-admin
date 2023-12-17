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
        cached = true, debounce = 800, _meta: { model, schema } = {},
        reducedColumns = true, usesData = [],
        // eslint-disable-next-line no-unused-vars
        initialValue, gridItem, rows, multiple = false,
        ...props
    } = field;

    const { state: [data], autocompleteProps: autocompletePropsFn } = form;

    const usesDataDependencies = usesData.map((useData) => data[useData]);

    const { value, ...autocompleteProps } = React.useMemo(
        () => autocompletePropsFn(name, { textFieldProps: { label: label || name } }),
        [autocompletePropsFn, label, name],
    );

    const [loading, setLoading] = React.useState(false);
    const [options, setOptions] = React.useState(initialOptions || []);
    const [inputText, setInputText] = React.useState('');

    const { t } = useTranslation();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedRequest = React.useCallback(_.debounce((_list, _inputText, _name, _cached, _model, _schema) => {
        const handleRequestResponse = (response: AxiosResponse<LaravelPaginatedResponse>) => {
            if (_cached) {
                setOptions((options) => [
                    ...options,
                    ...response.data.data.filter((option) => !options.some((o) => o.id === option.id)),
                ]);
                return;
            }
            setOptions(response.data.data);
        };

        if (typeof _list !== 'undefined') {
            setLoading(true);
            const search = new URLSearchParams();
            search.set('q', _inputText);
            if (usesData.length) {
                search.set('filters', JSON.stringify(usesData.reduce((acc: any, key: string) => {
                    acc[key] = data[key];
                    return acc;
                }, {})))
            }
            if (typeof _list === 'string' && route.exists(`admin.${_list}.list`)) {
                search.set('per_page', '30');
                if (reducedColumns) {
                    search.set('reducedColumns', 'true');
                }
                if (usesData.length) {
                    search.set('filters', JSON.stringify(usesData.reduce((acc: any, key: string) => {
                        acc[key] = data[key];
                        return acc;
                    }, {})))
                }
                axios(`${route(`admin.${_list}.list`)}?${search.toString()}`)
                    .then(handleRequestResponse)
                    .finally(() => setLoading(false));
                return;
            }
            if (_model && _schema) {
                search.set('name', _name);
                search.set('model', _model);
                search.set('schema', _schema);

                axios(`${route('admin.autocomplete')}?${search.toString()}`)
                    .then(handleRequestResponse)
                    .finally(() => setLoading(false));
            }
        }
    }, debounce), [reducedColumns, debounce]);

    React.useEffect(() => {
        debouncedRequest(list, inputText, name, cached, model, schema);
        return () => {
            debouncedRequest.cancel();
        };
    }, [list, inputText, name, cached, model, schema, ...usesDataDependencies]);

    const appliedValue = React.useMemo(() => {
        if (typeof value === 'undefined') {
            if (multiple) {
                return [];
            }
            return null;
        }
        return value;
    }, [value, multiple]);

    return (
        <Autocomplete
            fullWidth
            {...props}
            {...autocompleteProps}
            value={appliedValue}
            multiple={multiple}
            getOptionLabel={(option) => dotExists(option, labeledBy)
                ? dotAccessor(option, labeledBy)
                : JSON.stringify(option)}
            onInputChange={(event, newInputValue) => {
                console.log('got new input value ', { newInputValue, value: appliedValue });
                setInputText(newInputValue)
            }}
            inputValue={inputText}
            options={options}
            loading={loading}
            loadingText={t('loading')}
        />
    );
};

export default AutocompleteField;
