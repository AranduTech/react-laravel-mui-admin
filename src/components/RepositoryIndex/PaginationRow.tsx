/* eslint-disable react/forbid-prop-types */
import React from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';

import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import mediaQuery from './mediaQuery';

import useApplyFilters from '../../useApplyFilters';
import { Model } from '../../types/model';
import { useTranslation } from 'react-i18next';


export interface PaginationRowProps {
    items: Model[];
    pagination: {
        current_page?: number;
        per_page?: number;
        total?: number;
        last_page?: number;
        from?: number;
        to?: number;
    };
    setPage?: (page: number) => void;
    setPerPage?: (perPage: number) => void;
    colSpan?: number;
};

const PaginationRow = ({
    items, pagination,
    setPage = () => null,
    setPerPage = () => null,
    colSpan,
    // ...props,
}: PaginationRowProps) => {
    const {
        current_page: page = 1, per_page: perPage = 15,
        total = 0, last_page: lastPage = 1,
    } = pagination || {};

    const startIndex = (page - 1) * perPage;

    const isFull = useMediaQuery(mediaQuery);

    const paginationString = Object.keys(pagination).length > 0
        ? `Mostrando ${`${startIndex + 1} - ${startIndex + items.length}`} `
        + `de ${total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} resultados`
        : '';

    const rowsPerPageOptions: number[] = useApplyFilters(
        'repository_index_rows_per_page_options',
        [15, 30, 50],
    );

    const { t } = useTranslation();

    return (
        <TableRow>
            <TableCell
                colSpan={colSpan}
                sx={{ py: 1.5 }}
            >
                <Stack
                    direction={isFull ? 'row' : 'column-reverse'}
                    spacing={1}
                    justifyContent="space-between"
                >
                    <Typography
                        variant="body2"
                        sx={{ my: 'auto' }}
                    >
                        {paginationString}
                    </Typography>

                    <Stack
                        spacing={1}
                        direction={isFull ? 'row' : 'column-reverse'}
                    >
                        <Stack
                            direction="row"
                            sx={{
                                mr: 1,
                                my: 'auto',
                                alignItems: 'center',
                            }}
                        >
                            <Typography>
                                {t('table.rowsPerPage')}
                            </Typography>
                            <Select
                                variant="standard"
                                className="rowsPerPage"
                                value={perPage}
                                onChange={(e) => setPerPage(parseInt(e.target.value as any, 10))}
                            >
                                {rowsPerPageOptions.map((option) => (
                                    <MenuItem
                                        key={option}
                                        value={option}
                                    >
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Stack>
                        <Pagination
                            shape="rounded"
                            color="primary"
                            count={lastPage}
                            page={page}
                            onChange={(e, page) => setPage(page)}
                            sx={{ alignSelf: 'flex-end' }}
                        />
                    </Stack>
                </Stack>
            </TableCell>
        </TableRow>
    );
};

export default PaginationRow;
