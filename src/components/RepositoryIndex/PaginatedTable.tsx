import React from 'react';

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

import { Model, ModelTableColumnDefinition } from '../../types/model';
import { FormError, FormFieldDefinition, FormState } from '../../types/form';

import Form from '../Form/Form';
import usePaginatedTable from '../../usePaginatedTable';


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
    showSearch?: boolean;
    onPageChange: (page: number) => void;
    onPerPageChange?: (perPage: number) => void;
};

const PaginatedTable = ({
    items, massActions = [], columns = [], onSearch: handleSearchSubmit, filter,
    onMassAction: handleMassActionSubmit, onClickItem = () => null, pagination,
    onPageChange: handlePageChange, onPerPageChange: handlePerPageChange,
    onApplyFilters: handleApplyFilters = () => null, filtersApplied = {},
    orderBy, onSort: handleSort = () => null, showSearch = true,
    ...props
}: PaginatedTableProps) => {

    const {
        columnCount, isFull, searchFormProps, t, searchInputProps, massActionFormProps,
        massActionInputProps, checkSelected, checkIndeterminate, handleSelectAllClick,
        selected, massAction, filterForm,  sortColumn, sortDirection,
        filterId, handleFilterOpen, filterOpen, filterButtonEl, 
        handleClickHeaderCell, isSelected, handleSelected, handleFilterClose,
        handleFilterClear
    } = usePaginatedTable({
        items, massActions, columns, onSearch: handleSearchSubmit,
        onMassAction: handleMassActionSubmit, pagination,
        onPageChange: handlePageChange,
        onApplyFilters: handleApplyFilters, filtersApplied,
        orderBy, onSort: handleSort
    });

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
                                    {showSearch && (
                                        <Stack
                                            component="form"
                                            direction="row"
                                            spacing={2}
                                            autoComplete="off"
                                            {...searchFormProps()}
                                        >
                                            <TextField
                                                fullWidth={!isFull}
                                                // autoComplete="new-password"
                                                label={t('common.search')}
                                                size="small"
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
                                    )}

                                    <Stack
                                        direction="row"
                                        spacing={2}
                                    >
                                        {filter && (
                                            <>
                                                <IconButton
                                                    aria-describedby={filterId}
                                                    onClick={handleFilterOpen}
                                                >
                                                    <Badge color="primary" badgeContent={Object.keys(filtersApplied).length}>
                                                        <Icon name="filterList" />
                                                    </Badge>
                                                </IconButton>
                                                <Popover
                                                    id={filterId}
                                                    open={filterOpen}
                                                    anchorEl={filterButtonEl}
                                                    onClose={handleFilterClose}
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
                                                            submitText={t('common.apply') as string}
                                                            cancelText={t('common.clear') as string}
                                                            showCancelButton
                                                            onCancel={handleFilterClear}
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
