import React from 'react';

import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Unstable_Grid2';
import PaginatedTable from './PaginatedTable';
import AsyncModelForm from '../Form/AsyncModelForm';
import ActionButton from './ActionButton';

import useRepositoryIndex from '../../useRepositoryIndex';
// const Popper = MuiPopper as any;


const RepositoryIndex = () => {

    const {
        isFull, className, Model, t, filterFields, tableColumns, items, pagination, loading, 
        searchParams, modelTabs, modelMassActions, schema, setSearchParams,
        handleSearchSubmit, handleTabChange, handleMassActionSubmit, handleSort, handleApplyFilters,
        handleClickItem, handleSaveSuccess, tab, filters, order_by, handleCloseDrawer, open, setPage, setPerPage,
        handleFormError, handleFormChange,
    } = useRepositoryIndex();

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
                direction={isFull ? 'row' : 'column-reverse'}
                justifyContent={modelTabs.length > 0 ? 'space-between' : 'flex-end'}
                alignItems="center"
            >
                {modelTabs.length > 0 && (
                    <Tabs
                        value={tab}
                        onChange={handleTabChange}
                        sx={{ px: 1.25 }}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab
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
                <ActionButton 
                    isFull={isFull}
                    setSearchParams={setSearchParams}
                />
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
                columns={tableColumns}
                filter={filterFields}
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
                onClose={handleCloseDrawer}
                PaperProps={{ 
                    sx: {
                        p: 1.5,
                        py: isFull ? 10.5 : 2.5,
                        width: isFull ? 480 : '85%' 
                    },
                }}
            >
                <AsyncModelForm
                    model={Model}
                    schema={schema}
                    id={parseInt(searchParams.get('id') as string, 10)}
                    spacing={2}
                    onSuccess={handleSaveSuccess}
                    onError={handleFormError}
                    onChange={handleFormChange}
                    onCancel={handleCloseDrawer}
                    showCancelButton
                />
            </Drawer>
        </React.Fragment>
    );
};

export default RepositoryIndex;
