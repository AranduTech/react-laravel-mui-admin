import React from 'react';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import Icon from '../Icon';

import useApplyFilters from '../../useApplyFilters';
import { Model } from '../../types/model';
import doAction from '../../doAction';

export interface ActionItem {
    name: string;
    label: string;
    icon?: string;
}

export interface ActionButtonProps {
    item: Model;
}

const ActionButton = ({ item }: ActionButtonProps) => {
    const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
    const open = Boolean(anchorEl);
    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const itemActions = useApplyFilters(
        'repository_index_get_item_actions',
        [],
        item,
    );

    const specificItemActions = useApplyFilters(
        `repository_index_model_${item.className}_actions`,
        itemActions,
        item,
    );

    return (
        <>
            <IconButton onClick={handleClick}>
                <Icon name="moreVert" />
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{ 'aria-labelledby': 'basic-button' }}
            >
                {specificItemActions.map((action: ActionItem) => (
                    <MenuItem
                        key={action.name}
                        onClick={() => {
                            doAction(`repository_index_item_action_${action.name}`, item);
                            handleClose();
                        }}
                    >
                        {action.label}
                    </MenuItem>
                ))}
                {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem> */}
            </Menu>
        </>

    );
};

export default ActionButton;
