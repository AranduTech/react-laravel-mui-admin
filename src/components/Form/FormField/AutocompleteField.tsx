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
        reducedColumns = true, usesData = [], refreshWhileTyping = true,
        valuedBy = 'id',
        // eslint-disable-next-line no-unused-vars
        initialValue, gridItem, rows, multiple = false,
        ...props
    } = field;

    const { state: [data], autocompleteProps: autocompletePropsFn } = form;

    const usesDataDependencies = usesData.map((useData) => {
        if (typeof data[useData] === 'object' && !!data[useData] && (data[useData] as any).id) {
            return (data[useData] as any).id;
        }
        return data[useData];
    });

    const { value, ...autocompleteProps } = React.useMemo(
        () => autocompletePropsFn(name, { textFieldProps: { label: label || name } }),
        [autocompletePropsFn, label, name],
    );

    const [loading, setLoading] = React.useState(false);
    const [options, setOptions] = React.useState(initialOptions || []);
    const [inputText, setInputText] = React.useState('');

    const { t } = useTranslation();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedRequest = React.useCallback(_.debounce((_name, _cached, _model, _schema) => {
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

        if (typeof list !== 'undefined') {
            setLoading(true);
            const search = new URLSearchParams();
            search.set('q', inputText);
            if (usesData.length) {
                search.set('filters', JSON.stringify(usesData.reduce((acc: any, key: string) => {
                    acc[key] = data[key];
                    return acc;
                }, {})))
            }
            if (typeof list === 'string' && route.exists(`admin.${list}.list`)) {
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
                axios(`${route(`admin.${list}.list`)}?${search.toString()}`)
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
    }, debounce), [reducedColumns, list, inputText, usesData, data, debounce]);

    React.useEffect(() => {
        debouncedRequest(name, cached, model, schema);
        return () => {
            debouncedRequest.cancel();
        };
    }, [name, cached, model, schema, ...usesDataDependencies, ...(refreshWhileTyping ? [inputText] : [])]);

    console.log(`dependencies for field ${name}`, { usesDataDependencies, refreshWhileTyping, inputText });

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
            options={options}
            loading={loading}
            loadingText={t('loading')}
            isOptionEqualToValue={(option, value) => option[valuedBy] === value[valuedBy]}
            getOptionLabel={(option) => dotExists(option, labeledBy)
                ? dotAccessor(option, labeledBy)
                : JSON.stringify(option)}
            multiple={multiple}
            {...props}
            {...autocompleteProps}
            value={appliedValue}
            onInputChange={(event, newInputValue) => {
                console.log('got new input value ', { newInputValue, value: appliedValue });
                setInputText(newInputValue)
            }}
            inputValue={inputText}
        />
    );
};

export default AutocompleteField;
