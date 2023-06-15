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

interface ModelTab {
    name: string;
    label: string;
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

    const { tables: { default: defaultTable } } = React.useMemo(
        () => modelRepository.getClassSchema(className),
        [className],
    );

    const { t } = useTranslation();

    const {
        items, pagination,
        refresh, setPage, setTab, setPerPage, setSearch,
        query: { tab },
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
        // console.log(`run mass action ${massAction} on ${selected.length} items`, selected);
        doAction(
            `respository_index_mass_action_${massAction}`,
            selected,
            className,
        );
    };

    const handleClickItem: ((event: React.MouseEvent<unknown, MouseEvent>, item: Model) => void) = (event, item) => {
        if (item.deletedAt) {
            return;
        }

        doAction('repository_index_click_item', item, { navigate, setSearchParams });
    };

    const handleNewItem = () => {
        doAction('repository_index_new_item', className, { navigate, setSearchParams });
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
                <Button
                    variant="contained"
                    onClick={handleNewItem}
                    sx={{ mb: 2 }}
                >
                    {t('common.new')} {t(`models.${className}.singular`)}
                </Button>
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
                columns={defaultTable}
                massActions={modelMassActions}
                onSearch={handleSearchSubmit}
                onMassAction={handleMassActionSubmit}
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
