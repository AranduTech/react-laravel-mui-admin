import React from 'react';

import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import List, { ListTypeMap } from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import Icon from './Icon';
import RecursiveMenu from './RecursiveMenu';

import { MenuItem } from '../types/menu';
import { DefaultComponentProps } from '@mui/material/OverridableComponent';

export type RecursiveListProps = DefaultComponentProps<ListTypeMap> & {
    collapsed?: boolean;
    items: MenuItem[];
    onClick?: (e: any) => void;
};

const RecursiveList = ({
    collapsed = false, items, onClick,
    ...props
}: RecursiveListProps) => {
    const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
    const [dropItems, setDropItems] = React.useState<MenuItem[] | null>(null);
    const [childrenOpen, setChildrenOpen] = React.useState<{ [key: string]: boolean }>({});

    return (
        <List {...props}>
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
                        <ListItem
                            key={key}
                            disablePadding
                            sx={{ display: 'block' }}
                            {...ListItemProps}
                        >
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: !collapsed ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                                onClick={(e) => {
                                    if (onClickItem) {
                                        onClickItem(e);
                                    }
                                    if (children) {
                                        if (collapsed) {
                                            setDropItems(() => {
                                                setAnchorEl(e.currentTarget);
                                                return children;
                                            });
                                            return;
                                        }
                                        setChildrenOpen({
                                            ...childrenOpen,
                                            [key]: !childrenOpen[key],
                                        });
                                        return;
                                    }
                                    if (onClick) {
                                        onClick(e);
                                    }
                                }}
                                {...buttonProps}
                            >
                                {icon && (
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: !collapsed ? 3 : 'unset',
                                            justifyContent: 'center',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            color: 'inherit',
                                        }}
                                    >
                                        <Icon name={icon} />
                                        {collapsed && (
                                            <Typography
                                                fontSize={10}
                                                sx={{ mt: 0.5 }}
                                            >
                                                {text}
                                            </Typography>
                                        )}
                                    </ListItemIcon>
                                )}
                                {!collapsed
                                    && <ListItemText primary={text} />
                                }
                                {!collapsed && children && (
                                    <Icon
                                        name={childrenOpen[key]
                                            ? 'expandLess'
                                            : 'expandMore'}
                                    />)}
                            </ListItemButton>
                            {children && !collapsed && (
                                <Collapse
                                    in={childrenOpen[key]}
                                    timeout="auto"
                                    unmountOnExit
                                >
                                    <RecursiveList
                                        items={children}
                                        onClick={onClick}
                                        collapsed={collapsed}
                                        sx={{ pl: collapsed ? 0 : 2, pb: 0 }}
                                    />
                                </Collapse>
                            )}

                        </ListItem>
                    );
                })}
            {collapsed && (
                <RecursiveMenu
                    items={dropItems || []}
                    onClick={onClick}
                    collapsed={false}
                    sx={{ pl: collapsed ? 0 : 2, pb: 0 }}
                    anchorEl={anchorEl}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    RecursiveList={RecursiveList}
                    onClose={() => {
                        setAnchorEl(null);
                        setDropItems(null);
                    }}
                    open={Boolean(anchorEl)}
                    slotProps={{ paper: { sx: { minWidth: 280 } } }}
                />
            )}
        </List>
    );
};

// const ListItemPropTypes = PropTypes.oneOfType([
//     PropTypes.shape({ element: PropTypes.node.isRequired }),
//     PropTypes.shape({
//         key: PropTypes.number.isRequired,
//         text: PropTypes.string.isRequired,
//         icon: Icon.propTypes.name,
//         ListItemProps: PropTypes.any,
//         ListItemButtonProps: PropTypes.any,
//         children: PropTypes.array,
//     }),
// ]);

// RecursiveList.propTypes = {
//     collapsed: PropTypes.bool,
//     items: PropTypes.arrayOf(ListItemPropTypes),
//     onClick: PropTypes.func,
//     mode: PropTypes.oneOf(['list', 'menu']),
// };

export default RecursiveList;
