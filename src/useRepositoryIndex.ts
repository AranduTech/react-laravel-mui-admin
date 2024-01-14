import React from 'react';

import { useLoaderData, useNavigate } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';

import { useTranslation } from 'react-i18next';

import toastService from './internals/singletons/Toast';
import modelRepository from './internals/singletons/ModelRepository';

import useFetchList from './useFetchList';
import useApplyFilters from './useApplyFilters';
import useAddAction from './useAddAction';

import mediaQuery from './components/RepositoryIndex/mediaQuery';
import { FormState } from './types/form';
import doAction from './doAction';
import { Model } from './types/model';
import dialogService, { DialogOptions } from './internals/singletons/Dialog';

export interface ModelTab {
    name: string;
    label: string;
}

export default function useRepositoryIndex()
{

    const navigate = useNavigate();

    const isFull = useMediaQuery(mediaQuery);

    const { className } = useLoaderData() as any;

    const Model = React.useMemo(() => modelRepository.getModelClass(className), [className]);

    const {
        tables: { default: defaultTable },
        importable = false,
        exportable = false,
    } = React.useMemo(
        () => modelRepository.getClassSchema(className),
        [className],
    );

    const { t } = useTranslation();

    const filterFields = useApplyFilters(
        `repository_index_${className}_filter_fields`,
        defaultTable.filter,
    );

    const tableColumns = useApplyFilters(
        `repository_index_${className}_table_columns`,
        defaultTable.columns,
    );

    const {
        items, pagination,
        refresh, setPage, setTab, setPerPage, setSearch, setFilters, setOrderBy,
        query: { tab, filters, order_by },
        request: { loading, searchParams, setSearchParams },
    } = useFetchList(Model, { ignoreSearchParams: ['id'] });

    const [isDirty, setIsDirty] = React.useState(false);

    const doRefresh = useAddAction('repository_index_refresh', refresh);

    const preModelTabs = useApplyFilters(
        'repository_index_tabs',
        [],
        className,
    );

    const modelTabs: ModelTab[] = useApplyFilters(
        `repository_index_${className}_tabs`,
        preModelTabs,
    );

    const preModelMassActions = useApplyFilters(
        'repository_index_get_mass_actions',
        [],
        className,
        tab,
    );

    const modelMassActions = useApplyFilters(
        `repository_index_${className}_tab_${tab}_mass_actions`,
        preModelMassActions,
    );

    const schema = useApplyFilters(`repository_form_${className}_schema`, 'default');

    const handleSaveSuccess = () => {
        toastService.success(t('common.saved'));
        doRefresh();
        handleCloseDrawer();
    };

    const handleSearchSubmit = ({ search }: FormState) => {
        setSearch(search as string);
    };

    const handleTabChange: ((event: React.SyntheticEvent<Element, Event>, value: any) => void) = (e, v) => {
        setTab(v);
    };

    const handleMassActionSubmit = ({ massAction, selected }: FormState) => {
        doAction(
            `repository_index_mass_action_${massAction}`,
            selected,
            className,
        );
    };

    const handleSort = (field: string, direction?: 'asc' | 'desc') => {
        if (!field) {
            setSearchParams(() => {
                const { searchParams } = new URL(document.location.toString());
                searchParams.delete('order_by');
                return searchParams;
            });
            return;
        }
        setOrderBy(`${field}:${direction}`);
    };

    const handleApplyFilters = (filters: any) => {
        if (Object.keys(filters).length === 0) {
            setSearchParams(() => {
                const { searchParams } = new URL(document.location.toString());
                searchParams.delete('filters');
                return searchParams;
            });
            return;
        }
        setFilters(filters);
    }

    const handleClickItem: ((event: React.MouseEvent<unknown, MouseEvent>, item: Model) => void) = (event, item) => {
        if (item.deletedAt) {
            return;
        }
        setIsDirty(false);
        doAction('repository_index_click_item', item, { navigate, setSearchParams });
    };

    // If the current tab is not in the list of tabs, set the tab to 'all'
    React.useEffect(() => {
        if (tab !== 'all' && !modelTabs.find((t) => t.name === tab)) {
            setTab('all');
        }
    }, [modelTabs, tab, setTab]);

    const handleFormError = () => toastService.error(t('common.error'));
    const handleFormChange = () => setIsDirty(true);

    const handleCloseDrawer = async () => {
        const dialogOptions: DialogOptions = {
            message: t('common.unsavedChanges'),
            type: 'confirm',
            confirmText: t('yes') as string,
            cancelText: t('no') as string,
        };
        if (!isDirty || await dialogService.create(dialogOptions)) {
            return setSearchParams((searchParams) => {
                searchParams.delete('id');
                return searchParams;
            }, { replace: true });
        }
    };


    return {
        isFull, className, Model, defaultTable, importable, exportable, t,
        filterFields, tableColumns, items, pagination, loading, searchParams, isDirty,
        modelTabs, modelMassActions, schema, handleSaveSuccess, setSearchParams,
        handleSearchSubmit, handleTabChange, handleMassActionSubmit, handleSort, handleApplyFilters,
        handleClickItem, doRefresh, setIsDirty, tab, filters, order_by, handleCloseDrawer, open, setPage,
        setPerPage, setSearch, setFilters, setOrderBy, handleFormError, handleFormChange,

    };
}

// options, handleSplitButtonClick,
//         handleSplitMenuItemClick, handleSplitMenuToggle, handleSplitMenuClose, anchorRef, selectedIndex, 