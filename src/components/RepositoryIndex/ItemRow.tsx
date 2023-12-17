/* eslint-disable react/forbid-prop-types */
import React from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';

import Typography from '@mui/material/Typography';
import TableCell from '@mui/material/TableCell';
import TableRow, { TableRowTypeMap } from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';

import { dotAccessor } from '../../support/object';

import ActionButton from './ActionButton';
import mediaQuery from './mediaQuery';
import { Model, ModelTableColumnDefinition } from '../../types/model';
import { DefaultComponentProps } from '@mui/material/OverridableComponent';
import applyFilters from '../../applyFilters';

export interface ItemRowProps extends DefaultComponentProps<TableRowTypeMap> {
    item: Model;
    selectable?: boolean;
    columns: ModelTableColumnDefinition[];
    handleClick?: (event: React.MouseEvent<unknown>, item: Model) => void;
    onCheck?: (event: React.ChangeEvent<HTMLInputElement>, id: number) => void;

};

const ItemRow = ({
    item, selectable = false, handleClick, sx = {},
    selected, onCheck, columns,
    ...props
}: ItemRowProps) => {
    const isFull = useMediaQuery(mediaQuery);

    const getCellContent = React.useCallback(
        (item: Model, column: ModelTableColumnDefinition) => {
            const value = applyFilters(
                'repository_index_item_data',
                dotAccessor(item, column.key),
                item,
                column,
            );

            return applyFilters(
                `repository_index_${item.className}_column_${column.key}_content`,
                value,
                item,
            );
        },
        [],
    );

    return (
        <TableRow
            hover={!!handleClick}
            key={item.id}
            tabIndex={-1}
            selected={selected}
            sx={{ cursor: handleClick ? 'pointer' : 'unset', ...sx }}
            {...props}
        >
            {selectable && (
                <TableCell
                    padding="checkbox"
                    sx={{ width: isFull ? 'unset' : '1%' }}
                >
                    <Checkbox
                        color="primary"
                        checked={selected}
                        onChange={(e) => onCheck && onCheck(e, item.id)}
                        inputProps={
                            { 'aria-labelledby': `enhanced-table-checkbox-${item.id}` }
                        }
                        sx={{ p: isFull ? 1 : 0 }}
                    />
                </TableCell>
            )}

            {isFull && columns.map((column) => {
                const rawContent = getCellContent(item, column);

                const content = ['string', 'number'].includes(typeof rawContent)
                    ? <Typography>{rawContent}</Typography>
                    : rawContent;

                return (
                    <TableCell
                        key={column.key}
                        onClick={(e) => handleClick && handleClick(e, item)}
                    >
                        {content}
                    </TableCell>
                );
            })}
            {!isFull && (
                <TableCell
                    key="mobile"
                    onClick={(e) => handleClick && handleClick(e, item)}
                >
                    {columns.map((column) => {
                        const rawContent = getCellContent(item, column);

                        const content = ['string', 'number'].includes(typeof rawContent)
                            ? <Typography><b>{column.label}:</b> {rawContent}</Typography>
                            : (
                                <>
                                    <Typography sx={{ display: 'inline' }}><b>{column.label}:</b></Typography>{' '}{rawContent}
                                </>
                            );

                        return (
                            <React.Fragment key={column.key}>
                                {content}
                            </React.Fragment>
                        );
                    })}
                </TableCell>
            )}
            <TableCell sx={{ width: '1%', px: { xs: 0, md: 2 } }}>
                <ActionButton item={item} />
            </TableCell>
        </TableRow>
    );
};

export default ItemRow;
