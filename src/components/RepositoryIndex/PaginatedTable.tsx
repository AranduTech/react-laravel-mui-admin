import React, { ChangeEvent, MouseEvent } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';

import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';

import Icon from '../Icon';
import PaginationRow from './PaginationRow';
import ItemRow from './ItemRow';

import useForm from '../../useForm';

import mediaQuery from './mediaQuery';
import { Model, ModelTableColumnDefinition } from '../../types/model';
import { FormError, FormFieldDefinition, FormState } from '../../types/form';
import { useTranslation } from 'react-i18next';
import Form from '../Form/Form';


export interface PaginatedTableProps {
    items: Model[];
    filter?: Array<FormFieldDefinition>,
    filtersApplied?: any,
    orderBy: string;
    massActions?: { label: string, name: string }[];
    columns?: ModelTableColumnDefinition[];
    onSearch: (data: FormState, setErrors?: (errors: FormError[]) => void) => void | Promise<void>;
    onMassAction?: (data: FormState, setErrors?: (errors: FormError[]) => void) => void | Promise<void>;
    onClickItem?: (event: React.MouseEvent<unknown>, item: Model) => void;
    onApplyFilters?: (data: FormState) => void;
    onSort?: (field: string, direction?: 'asc' | 'desc') => void;
    pagination: {
        current_page?: number;
        per_page?: number;
        total?: number;
        last_page?: number;
        from?: number;
        to?: number;
    };
    onPageChange: (page: number) => void;
    onPerPageChange?: (perPage: number) => void;
};

const PaginatedTable = ({
    items, massActions = [], columns = [], onSearch: handleSearchSubmit, filter,
    onMassAction: handleMassActionSubmit, onClickItem = () => null, pagination,
    onPageChange: handlePageChange, onPerPageChange: handlePerPageChange,
    onApplyFilters: handleApplyFilters = () => null, filtersApplied = {},
    orderBy, onSort: handleSort = () => null,
    ...props
}: PaginatedTableProps) => {
    const isFull = useMediaQuery(mediaQuery);

    const { t } = useTranslation();

    const [filterButtonEl, setFilterButtonEl] = React.useState<HTMLButtonElement | null>(null);

    const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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
        debug: true,
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

    return (
        <TableContainer component={Paper}>
            <Table {...props}>
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={columnCount}>
                            <Stack
                                direction={isFull ? 'row' : 'column'}
                                spacing={1}
                                justifyContent="space-between"
                                alignItems="stretch"
                            >
                                <Stack direction="row">
                                    <Stack
                                        component="form"
                                        direction="row"
                                        spacing={2}
                                        {...searchFormProps()}
                                    >
                                        <TextField
                                            fullWidth={!isFull}
                                            type="search"
                                            label={t('common.search')}
                                            size="small"
                                            autoComplete="off"
                                            InputProps={{
                                                endAdornment: (
                                                    <IconButton
                                                        size="small"
                                                        type="submit"
                                                    >
                                                        <Icon name="search" />
                                                    </IconButton>
                                                ),
                                            }}
                                            {...searchInputProps('search', (e) => {
                                                if (e.target.value === '') {
                                                    handleSearchSubmit({ search: '' }, () => null);
                                                }
                                                return e.target.value;
                                            })}
                                        />

                                    </Stack>
                                    <Stack
                                        direction="row"
                                        spacing={2}
                                    >
                                        {filter && (
                                            <>
                                                <IconButton
                                                    aria-describedby={filterId}
                                                    onClick={handleFilterClick}
                                                >
                                                    <Badge color="primary" badgeContent={Object.keys(filtersApplied).length}>
                                                        <Icon name="filterList" />
                                                    </Badge>
                                                </IconButton>
                                                <Popover
                                                    id={filterId}
                                                    open={filterOpen}
                                                    anchorEl={filterButtonEl}
                                                    onClose={() => {
                                                        handleFilterClose();
                                                        setFilterFormState(filtersApplied);
                                                    }}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'left',
                                                    }}
                                                >
                                                    <Paper sx={{ p: 2, maxWidth: 'min(700px, 80vw)' }}>
                                                        <Form
                                                            fields={filter}
                                                            form={filterForm}
                                                            spacing={1}
                                                            submitText="Filtrar"
                                                            cancelText="Limpar"
                                                            showCancelButton
                                                            onCancel={() => {
                                                                setFilterFormState({});
                                                                handleApplyFilters({});
                                                                handleFilterClose();
                                                            }}
                                                        />
                                                    </Paper>
                                                </Popover>
                                            </>
                                        )}
                                    </Stack>
                                </Stack>
                                <Stack
                                    component="form"
                                    direction="row"
                                    justifyContent="stretch"
                                    spacing={2}
                                    {...massActionFormProps()}
                                >
                                    
                                    <FormControl
                                        size="small"
                                        fullWidth={!isFull}
                                        sx={{ minWidth: 180 }}
                                    >
                                        <InputLabel id="mass-actions-label">
                                            {t('table.actions.select')}
                                        </InputLabel>
                                        <Select
                                            label={t('table.actions.select')}
                                            labelId="mass-actions-label"
                                            disabled={(selected as number[]).length === 0}
                                            {...massActionInputProps('massAction') as any}
                                        >
                                            {massActions.map((action) => (
                                                <MenuItem
                                                    key={action.name}
                                                    value={action.name}
                                                >
                                                    {action.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        type="submit"
                                        disabled={(selected as number[]).length === 0 || massAction === ''}
                                    >
                                        {t('table.actions.submit')}
                                    </Button>
                                </Stack>

                            </Stack>
                            {!isFull && (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            color="primary"
                                            indeterminate={checkIndeterminate}
                                            checked={checkSelected}
                                            onChange={handleSelectAllClick}
                                            inputProps={{ 'aria-label': 'select all' }}
                                        />
                                    }
                                    label={t('table.actions.selectAll')}
                                />

                            )}
                        </TableCell>
                    </TableRow>
                    {isFull && (
                        <TableRow>
                            {massActions.length > 0 && (
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        indeterminate={checkIndeterminate}
                                        checked={checkSelected}
                                        onChange={handleSelectAllClick}
                                        inputProps={{ 'aria-label': 'select all' }}
                                    />
                                </TableCell>
                            )}
                            {columns.map((column) => (
                                <TableCell 
                                    key={column.key} 
                                    onClick={handleClickHeaderCell(column)}
                                    sx={{ cursor: column.sortable ? 'pointer' : 'default' }}
                                >
                                    <Typography variant="h6">
                                        {column.label}{column.key === sortColumn && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                                    </Typography>
                                </TableCell>
                            ))}
                            <TableCell sx={{ width: '1%' }} />
                        </TableRow>
                    )}
                </TableHead>
                <TableBody>
                    {items.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={columnCount}>
                                <Typography
                                    variant="body1"
                                    textAlign="center"
                                >
                                    {t('common.noResults')}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                    {items.map((item) => (
                        <ItemRow
                            key={item.id}
                            item={item}
                            columns={columns}
                            selectable={massActions.length > 0}
                            selected={isSelected(item.id)}
                            handleClick={onClickItem}
                            onCheck={handleSelected}
                            role="checkbox"
                            aria-checked={isSelected(item.id)}
                        />
                    ))}
                </TableBody>
                <TableFooter>
                    {pagination && (
                        <PaginationRow
                            colSpan={columnCount}
                            items={items}
                            pagination={pagination}
                            setPage={handlePageChange}
                            setPerPage={handlePerPageChange}
                        />
                    )}
                </TableFooter>
            </Table>
        </TableContainer>

    );
};

export default PaginatedTable;
