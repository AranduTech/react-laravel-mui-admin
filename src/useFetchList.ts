import useApiRequest from './useApiRequest';

import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Model as ModelClass, ModelConstructorAttributes } from './types/model';
import route from './route';
import { LaravelPaginatedResponse } from './types/laravel';

interface UseFetchListOptions {
    ignoreSearchParams?: string[];
}

/**
 * UseFetchList.
 *
 * @param Model - Modelo.
 * @param options - Opções.
 * @return - Dados da requisição.
 */
const useFetchList = (Model: typeof ModelClass, options?: UseFetchListOptions) => {
    const { ignoreSearchParams = [] } = options || {};

    const [searchParams, setSearchParams] = useSearchParams(new URL(document.location.toString()).searchParams);

    const url = React.useMemo(() => {
        const params = new URLSearchParams();

        searchParams.forEach((value, key) => {
            if (ignoreSearchParams.includes(key)) {
                return;
            }
            params.set(key, searchParams.get(key) as string);
        });

        return `${route(`admin.${Model.getSchemaName()}.list`)}?${params.toString()}`;
    }, [searchParams, Model, ignoreSearchParams]);

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
    } = React.useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);

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
        setSearchParams(() => {
            const { searchParams } = new URL(document.location.toString());
            searchParams.set('tab', value);
            return searchParams;
        }, { replace: true });
    }, [setSearchParams]);

    const setPage = React.useCallback((value: string) => {
        setSearchParams(() => {
            const { searchParams } = new URL(document.location.toString());
            searchParams.set('page', value);
            return searchParams;
        }, { replace: true });
    }, [setSearchParams]);

    const setPerPage = React.useCallback((value: string) => {
        setSearchParams(() => {
            const { searchParams } = new URL(document.location.toString());
            searchParams.set('per_page', value);
            return searchParams;
        }, { replace: true });
    }, [setSearchParams]);

    const setSearch = React.useCallback((value: string) => {
        setSearchParams(() => {
            const { searchParams } = new URL(document.location.toString());
            searchParams.set('q', value);
            return searchParams;
        }, { replace: true });
    }, [setSearchParams]);

    const setFilters = React.useCallback((value: any) => {
        setSearchParams(() => {
            const { searchParams } = new URL(document.location.toString());
            searchParams.set('filters', JSON.stringify(value));
            return searchParams;
        }, { replace: true });
    }, [setSearchParams]);

    const setOrderBy = React.useCallback((value: string) => {
        setSearchParams(() => {
            const { searchParams } = new URL(document.location.toString());
            searchParams.set('order_by', value);
            return searchParams;
        }, { replace: true });
    }, [setSearchParams]);

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
            searchParams,
            setSearchParams,
        },

    };
};

export default useFetchList;