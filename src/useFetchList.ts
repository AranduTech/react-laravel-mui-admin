import useApiRequest from './useApiRequest';

import React from 'react';

import {  Model as ModelClass, ModelConstructorAttributes } from './types/model';
import route from './route';
import { LaravelPaginatedResponse } from './types/laravel';

type UseFetchListOptions = {
    initialQuery?: {
        [key: string]: string,
    };
};

/**
 * UseFetchList.
 *
 * @param Model - Modelo.
 * @param options - Opções.
 * @return - Dados da requisição.
 */
const useFetchList = (Model: typeof ModelClass, options: UseFetchListOptions = {}) => {

    // const [searchParams, setSearchParams] = useSearchParams(new URL(document.location.toString()).searchParams);
    const { initialQuery = {} } = options;

    const [query, setQuery] = React.useState(initialQuery);

    const url = React.useMemo(() => {
        const params = new URLSearchParams();

        Object.entries(query).forEach(([key, value]) => {
            params.set(key, value);
        });

        return `${route(`admin.${Model.getSchemaName()}.list`)}?${params.toString()}`;
    }, [query, Model]);

    const {
        response, error, loading, refresh,
    } = useApiRequest<LaravelPaginatedResponse>({ url });

    const {
        page = '1',
        per_page: perPage = '15',
        q: search = '',
        tab = 'all',
        filters = '{}',
        order_by = '',
    } = query;//React.useMemo(() => Object.fromEntries((searchParams as any).entries()), [searchParams]);

    const {
        data: responseData,
        // eslint-disable-next-line no-unused-vars
        first_page_url, last_page_url, next_page_url, prev_page_url, links, path,
        ...pagination
    } = response || {};

    const items = React.useMemo(
        () => responseData
            ? responseData.map((attributes) => new Model(attributes))
            : [],
        [responseData, Model],
    );

    const setTab = React.useCallback((value: string) => {
        setQuery((prev) => ({ ...prev, tab: value }));
    }, []);

    const setPage = React.useCallback((value: string) => {
        setQuery((prev) => ({ ...prev, page: value }));
    }, []);

    const setPerPage = React.useCallback((value: string) => {
        setQuery((prev) => ({ ...prev, per_page: value }));
    }, []);

    const setSearch = React.useCallback((value: string) => {
        setQuery((prev) => ({ ...prev, q: value }));
    }, []);

    const setFilters = React.useCallback((value: any) => {
        setQuery((prev) => ({ ...prev, filters: JSON.stringify(value) }));
    }, []);

    const setOrderBy = React.useCallback((value: string) => {
        setQuery((prev) => ({ ...prev, order_by: value }));
    }, []);

    return {
        items,

        query: {
            perPage,
            page,
            tab,
            search,
            filters,
            order_by,
        },

        pagination,

        setPage,
        setPerPage,
        setSearch,
        setTab,
        setFilters,
        setOrderBy,

        refresh,

        request: {
            response,
            error,
            loading,
            currentQuery: query,
            setQuery,
        },

    };
};

export default useFetchList;