import React from 'react';

import Button, { ButtonProps } from '@mui/material/Button';
import ButtonGroup, { ButtonGroupOwnProps } from '@mui/material/ButtonGroup';
import Popper from '@mui/material/Popper';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MuiFab, { FabProps } from '@mui/material/Fab';
import MuiSpeedDial, { SpeedDialProps } from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import Icon from '../Icon';

import useApplyFilters from '../../useApplyFilters';
import { useLoaderData, useNavigate, SetURLSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';

import doAction from '../../doAction';

export type ModelAction = {
    label: string;
    icon?: string;
    callback: () => void;
}

type ActionButtonProps = {
    overrideClassName?: string;
    setSearchParams: SetURLSearchParams;
    slotProps?: {
        ButtonGroup?: ButtonGroupOwnProps;
        Button?: ButtonProps;
        Fab?: FabProps;
        SpeedDial?: SpeedDialProps;
    };
    isFull?: boolean;
};


const Fab = styled(MuiFab)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
}));

const SpeedDial = styled(MuiSpeedDial)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
}));

const ActionButton: React.FunctionComponent<ActionButtonProps> = ({
    overrideClassName = null,
    setSearchParams,
    slotProps = {},
    isFull = true,
}) => {

    const { className: loaderClassName } = useLoaderData() as any;

    const className = overrideClassName ?? loaderClassName;

    const navigate = useNavigate();

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const { t } = useTranslation();

    const preOptions = useApplyFilters(
        'repository_index_model_actions',
        [{
            label: `${t('common.new')} ${t(`models.${className}.singular`)}`,
            callback: () => doAction(
                'repository_index_new_item',
                className,
                { navigate, setSearchParams }
            ),
            icon: 'add',
        }], 
        className,
    );

    const options: ModelAction[] = useApplyFilters(
        `repository_index_${className}_actions`,
        preOptions,
    );

    const handleSplitButtonClick = (callback: () => void,) => {
        callback();
    };

    const handleSplitMenuItemClick = (
        _: React.MouseEvent<HTMLLIElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setOpen(false);
    };

    const handleSplitMenuToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleSplitMenuClose = (event: Event) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setOpen(false);
    };

    const {
        ButtonGroup: ButtonGroupProps,
        Button: ButtonProps,
        Fab: FabProps,
        SpeedDial: SpeedDialProps,
    } = slotProps;

    return (
        <>
            {options.length > 0 && (
                <ButtonGroup 
                    variant="contained"
                    ref={anchorRef}
                    aria-label="split button"
                    sx={{ display: isFull ? 'flex' : 'none' }}
                    {...ButtonGroupProps}
                >
                    <Button
                        {...ButtonProps}
                        onClick={() => handleSplitButtonClick(options[selectedIndex].callback)}
                    >
                        {options[selectedIndex].label}
                    </Button>

                    {options.length > 1 && (
                        <Button
                            variant="contained"
                            size="small"
                            aria-controls={open ? 'split-button-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-label="select model action"
                            aria-haspopup="menu"
                            {...ButtonProps}
                            onClick={handleSplitMenuToggle}
                        >
                            <Icon name="arrowDropDown" />
                        </Button>
                    )}
                </ButtonGroup>
            )}

            <Popper
                sx={{ zIndex: 9 }}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin: placement === 'bottom'
                                ? 'center top'
                                : 'center bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleSplitMenuClose}>
                                <MenuList id="split-button-menu" autoFocusItem>
                                    {options.map((option, index) => (
                                        <MenuItem
                                            key={option.label}
                                            selected={index === selectedIndex}
                                            onClick={(event) => handleSplitMenuItemClick(event, index)}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>

            {options.length === 1 && (
                <Fab 
                    color="primary" 
                    aria-label={options[0].label}
                    sx={{
                        display: isFull ? 'none' : 'flex'
                    }}
                    {...FabProps}
                    onClick={() => handleSplitButtonClick(options[0].callback)}
                >
                    <Icon name={options[0].icon || 'add'} />
                </Fab>
            )}

            {options.length > 1 && (
                <SpeedDial
                    ariaLabel="select model action"
                    icon={<SpeedDialIcon />}
                    sx={{
                        display: isFull ? 'none' : 'flex'
                    }}
                    {...SpeedDialProps}
                >
                    {options.map(({ icon, label, callback }) => (
                        <SpeedDialAction
                            key={label}
                            icon={icon 
                                ? <Icon name={icon} />
                                : label.charAt(0).toUpperCase()}
                            tooltipTitle={label}
                            onClick={() => handleSplitButtonClick(callback)}
                        />
                    ))}
                </SpeedDial>
            )}
        </>
    )
};

export default ActionButton;


