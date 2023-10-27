import React from 'react';

import { useLoaderData, useNavigate } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Unstable_Grid2';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import MuiPopper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

import { useTranslation } from 'react-i18next';

import toastService from '../../internals/singletons/Toast';
import modelRepository from '../../internals/singletons/ModelRepository';

import useFetchList from '../../useFetchList';
import useApplyFilters from '../../useApplyFilters';
import useAddAction from '../../useAddAction';

import PaginatedTable from './PaginatedTable';
import AsyncModelForm from '../Form/AsyncModelForm';

import mediaQuery from './mediaQuery';
import { FormState } from '../../types/form';
import doAction from '../../doAction';
import { Model } from '../../types/model';

const Popper = MuiPopper as any;

interface ModelTab {
    name: string;
    label: string;
}

interface ModelActions {
    label: string;
    callback: () => void;
}

const RepositoryIndex = () => {
    const navigate = useNavigate();

    const isFull = useMediaQuery(mediaQuery);

    const drawerSx = {
        width: 300,
        p: 1.5,
        py: isFull ? 10.5 : 2.5,
    };

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

    const {
        items, pagination,
        refresh, setPage, setTab, setPerPage, setSearch, setFilters, setOrderBy,
        query: { tab, filters, order_by },
        request: { loading, searchParams, setSearchParams },
    } = useFetchList(Model, { ignoreSearchParams: ['id'] });

    const doRefresh = useAddAction('repository_index_refresh', refresh);

    const modelTabs: ModelTab[] = useApplyFilters(
        'repository_index_tabs',
        [],
        className,
    );

    const modelMassActions = useApplyFilters(
        'repository_index_get_mass_actions',
        [],
        className,
        tab,
    );

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const options: ModelActions[] = useApplyFilters(
        'repository_index_model_actions',
        [{
            label: `${t('common.new')} ${t(`models.${className}.singular`)}`,
            callback: () => doAction(
                'repository_index_new_item',
                className,
                { navigate, setSearchParams }
            )
        }],
        className,
    );

    const handleSplitButtonClick = (callback: () => void,) => {
        callback();
    };

    const handleSplitMenuItemClick = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>,
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

    const closeDrawer = () => setSearchParams((searchParams) => {
        searchParams.delete('id');
        return searchParams;
    }, { replace: true });

    const handleDrawer = (msg: string, status: 'success' | 'info' | 'warning' | 'error' = 'success') => {
        toastService[status](t(msg));
        doRefresh();
        closeDrawer();
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

        doAction('repository_index_click_item', item, { navigate, setSearchParams });
    };

    // If the current tab is not in the list of tabs, set the tab to 'all'
    React.useEffect(() => {
        if (tab !== 'all' && !modelTabs.find((t) => t.name === tab)) {
            setTab('all');
        }
    }, [modelTabs, tab, setTab]);

    return (
        <React.Fragment>

            <Typography
                variant="h5"
                component="h1"
                textAlign={{ xs: 'center', md: 'left' }}
                sx={{ my: { xs: 2, md: 0 } }}
                gutterBottom
            >
                {t(`models.${className}.plural`)}
            </Typography>

            <Stack
                direction="row"
                justifyContent={modelTabs.length > 0 ? 'space-between' : 'flex-end'}
                alignItems="center"
            >
                {modelTabs.length > 0 && (
                    <Tabs
                        value={tab}
                        onChange={handleTabChange}
                        sx={{ px: 1.25 }}
                    >
                        <Tab
                            // eslint-disable-next-line i18next/no-literal-string
                            value="all"
                            label={t('common.all')}
                        />
                        {modelTabs.map((tab) => (
                            <Tab
                                key={tab.name}
                                value={tab.name}
                                label={tab.label}
                            />
                        ))}
                    </Tabs>
                )}

                <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
                    <Button onClick={() => handleSplitButtonClick(options[selectedIndex].callback)}>
                        {options[selectedIndex].label}
                    </Button>
                    {options.length > 1 && (
                        <Button
                            variant="contained"
                            size="small"
                            aria-controls={open ? 'split-button-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-label="select merge strategy"
                            aria-haspopup="menu"
                            onClick={handleSplitMenuToggle}
                        >
                            <ArrowDropDownIcon />
                        </Button>
                    )}
                </ButtonGroup>
                <Popper
                    sx={{ zIndex: 9 }}
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    transition
                    disablePortal
                >
                    {({ TransitionProps, placement }: any) => (
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
            </Stack>

            <Grid
                container
                justifyContent="center"
                alignItems="center"
                sx={{
                    // height: 0,
                    transition: 'height 0.1s ease-in-out',
                    overflow: 'hidden',
                    height: loading ? 64 : 0,
                    backgroundColor: 'palette.divider',
                }}
            >
                <Grid sx={{ p: 2 }}>
                    <CircularProgress size={30} />
                </Grid>
            </Grid>
            <PaginatedTable
                items={items}
                columns={defaultTable.columns}
                filter={defaultTable.filter}
                filtersApplied={JSON.parse(filters)}
                massActions={modelMassActions}
                orderBy={order_by}
                onSort={handleSort}
                onSearch={handleSearchSubmit}
                onMassAction={handleMassActionSubmit}
                onApplyFilters={handleApplyFilters}
                onPageChange={(page) => setPage(`${page}`)}
                onPerPageChange={(perPage) => setPerPage(`${perPage}`)}
                onClickItem={handleClickItem}
                pagination={pagination}
            />

            <Drawer
                anchor="right"
                open={searchParams.has('id')}
                onClose={closeDrawer}
                PaperProps={{ sx: { ...drawerSx, width: isFull ? 480 : '85%' } }}
            >
                <AsyncModelForm
                    model={Model}
                    id={parseInt(searchParams.get('id') as string, 10)}
                    spacing={2}
                    onSuccess={() => handleDrawer('common.saved')}
                    onError={() => toastService.error(t('common.error'))}
                    onCancel={closeDrawer}
                    showCancelButton
                />
            </Drawer>
        </React.Fragment>
    );
};

export default RepositoryIndex;
