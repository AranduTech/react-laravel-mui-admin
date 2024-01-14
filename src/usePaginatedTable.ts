
import React, { ChangeEvent, MouseEvent } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';

import useForm from './useForm';

import mediaQuery from './components/RepositoryIndex/mediaQuery';
import { ModelTableColumnDefinition } from './types/model';

import { PaginatedTableProps } from './components/RepositoryIndex/PaginatedTable';

import { useTranslation } from 'react-i18next';


export default function usePaginatedTable(props: Omit<PaginatedTableProps, 'filter' | 'onPerPageChange' | 'onClickItem'>)
{

    const {
        items, massActions = [], columns = [], onSearch: handleSearchSubmit,
        onMassAction: handleMassActionSubmit, pagination,
        onPageChange: handlePageChange,
        onApplyFilters: handleApplyFilters = () => null, filtersApplied = {},
        orderBy, onSort: handleSort = () => null,
    } = props;

    const isFull = useMediaQuery(mediaQuery);

    const { t } = useTranslation();

    const [filterButtonEl, setFilterButtonEl] = React.useState<HTMLButtonElement | null>(null);

    const handleFilterOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setFilterButtonEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setFilterButtonEl(null);
    }

    const filterOpen = Boolean(filterButtonEl);
    const filterId = filterOpen ? 'filter-popover' : undefined;

    const {
        formProps: searchFormProps,
        inputProps: searchInputProps,
    } = useForm({
        initialValues: { search: new URLSearchParams(window.location.search).get('q') || '' },
        onSubmit: handleSearchSubmit,
    });

    const {
        state: [{ massAction, selected }, setMassActionFormState],
        formProps: massActionFormProps,
        inputProps: massActionInputProps,
    } = useForm({
        initialValues: {
            massAction: '',
            selected: [],
        },
        onSubmit: handleMassActionSubmit,
    });

    const filterForm = useForm({
        initialValues: filtersApplied,
        preventStructureChange: false,
        onSubmit: (data) => {
            const payload = Object.keys(data).reduce((acc, key) => {
                if (!data[key] || (Array.isArray(data[key]) && (data[key] as Array<any>).length === 0)) {
                    return acc;
                }
                return {
                    ...acc,
                    [key]: data[key],
                };
            }, {});
            handleApplyFilters(payload);
            handleFilterClose();
        },
        // debug: true,
    });

    const { 
        state: [_filterFormData, setFilterFormState],
    } = filterForm;

    // reseta a seleção quando listagem muda
    // reseta a ação em massa quando listagem muda
    React.useEffect(() => {
        setMassActionFormState({
            massAction: '',
            selected: [],
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items]);

    React.useEffect(() => {
        if (!pagination.current_page || !pagination.last_page) {
            return;
        }
        if (pagination.current_page > pagination.last_page) {
            handlePageChange(pagination.last_page);
        }
    }, [pagination.current_page, pagination.last_page, handlePageChange]);

    const handleSelected = (event: ChangeEvent<HTMLInputElement>, id: number) => {
        const newSelected = event.target.checked
            ? [...(selected as number[]), id]
            : (selected as number[]).filter((selectedId) => selectedId !== id);

        setMassActionFormState({
            massAction,
            selected: newSelected,
        });
    };

    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = items.map((n) => n.id);
            setMassActionFormState({
                massAction,
                selected: newSelected,
            });
            return;
        }
        setMassActionFormState({
            massAction,
            selected: [],
        });
    };

    const handleClickHeaderCell = (column: ModelTableColumnDefinition) => () => {
        if (column.sortable) {
            if (column.key === sortColumn) {
                if (sortDirection === 'asc') {
                    handleSort(column.key, 'desc');
                    return;
                }
                if (sortDirection === 'desc') {
                    handleSort('');
                }
                return;
            }

            handleSort(column.key, 'asc');
        }
    };

    const isSelected = (id: number) => (selected as number[]).indexOf(id) !== -1;

    const dataColumns = isFull
        ? columns.length
        : 1;

    const columnCount = massActions.length === 0
        ? dataColumns + 1
        : dataColumns + 2;

    const checkIndeterminate = (selected as number[]).length > 0 && (selected as number[]).length < items.length;
    const checkSelected = items.length > 0 && (selected as number[]).length === items.length;

    const [sortColumn = '', sortDirection = ''] = orderBy.split(':');

    const handlePopoverClose = () => {
        handleFilterClose();
        setFilterFormState(filtersApplied);
    };

    const handleFilterClear = () => {
        setFilterFormState({});
        handleApplyFilters({});
        handleFilterClose();                      
    };

    return {
        columnCount, isFull, searchFormProps, t, searchInputProps, massActionFormProps,
        massActionInputProps, checkSelected, checkIndeterminate, handleSelectAllClick,
        selected, massAction, filterForm, sortColumn, sortDirection,
        filterId, handleFilterOpen, filterOpen, filterButtonEl, 
        handleClickHeaderCell, isSelected, handleSelected, handleFilterClose: handlePopoverClose,
        handleFilterClear
    };
}
