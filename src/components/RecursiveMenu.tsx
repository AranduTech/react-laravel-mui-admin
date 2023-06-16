import React from 'react';

import MenuItem from '@mui/material/MenuItem';
import Menu, { MenuProps } from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import Icon from './Icon';
import { MenuItem as MenuItemObject } from '../types/menu';
import RecursiveList from './RecursiveList';


export type RecursiveMenuProps = MenuProps & {
    collapsed?: boolean;
    items: MenuItemObject[];
    onClick?: (e: any) => void;
    RecursiveList: typeof RecursiveList;
}

const RecursiveMenu = ({
    collapsed = false, items, onClick, RecursiveList,
    ...props
}: RecursiveMenuProps) => {
    const [childrenOpen, setChildrenOpen] = React.useState<{ [key: string]: Element | null }>({});

    return (
        <>
            <Menu {...props}>
                {items
                    .filter(({ hidden = () => false }) => !hidden())
                    .map((item) => {
                        const {
                            text, icon, ListItemButtonProps = {}, element = null,
                            key, ListItemProps = {}, children,
                        } = item;

                        if (element) {
                            return element;
                        }

                        const { onClick: onClickItem, ...buttonProps } = ListItemButtonProps;

                        return (
                            <MenuItem
                                key={key}
                                onClick={(e) => {
                                    if (onClickItem) {
                                        onClickItem(e as any);
                                    }
                                    if (children) {
                                        setChildrenOpen({
                                            ...childrenOpen,
                                            [key]: childrenOpen[key] ? null : e.currentTarget,
                                        });
                                        return;
                                    }
                                    if (onClick) {
                                        onClick(e);
                                    }
                                }}
                                {...ListItemProps}
                                {...buttonProps as any}
                            >
                                {icon && (
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: !collapsed ? 3 : 'auto',
                                            justifyContent: 'center',
                                            color: 'inherit',
                                        }}
                                    >
                                        <Icon name={icon} />
                                    </ListItemIcon>
                                )}
                                <ListItemText sx={{ opacity: !collapsed ? 1 : 0 }}>
                                    {text}
                                </ListItemText>
                                {!collapsed && children && (
                                    <Icon
                                        name="chevronRight"
                                    />
                                )}
                            </MenuItem>
                        );
                    })}
            </Menu>
            {items.map((item) => {
                const { key, children } = item;

                if (!children) {
                    return null;
                }

                return (
                    <RecursiveList
                        key={key}
                        items={children}
                        onClick={onClick}
                        collapsed={collapsed}
                        sx={{ pl: collapsed ? 0 : 2, pb: 0 }}
                    // anchorEl={childrenOpen[key]}
                    // anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    // onClose={() => setChildrenOpen({
                    //     ...childrenOpen,
                    //     [key]: null,
                    // })}
                    // open={Boolean(childrenOpen[key])}
                    // slotProps={{ paper: { sx: { minWidth: 280 } } }}
                    />
                );
            })}
        </>
    );
};

export default RecursiveMenu;
