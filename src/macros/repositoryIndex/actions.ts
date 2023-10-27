import macroService from '../../internals/singletons/MacroService';
import dialogService from '../../internals/singletons/Dialog';
import toastService from '../../internals/singletons/Toast';

import t from '../../t';
import { Model } from '../../types/model';
import axios from 'axios';
import route from '../../route';

export default {

    deleteItem: (item: Model) => {
        dialogService.create({
            title: t('table.actions.delete.title') as string,
            message: t('table.actions.delete.confirm'),
            type: 'confirm',
            confirmText: t('yes') as string,
            cancelText: t('no') as string,
        }).then(async (result) => {
            if (result) {
                const response = await item.delete();
                if (response) {
                    toastService.success(t('common.deleted'));

                    macroService.doAction('repository_index_refresh');
                } else {
                    toastService.error(t('common.error'));
                }
            }
        });
    },

    restoreItem: (item: Model) => {
        dialogService.create({
            title: t('table.actions.restore.title') as string,
            message: t('table.actions.restore.confirm') as string,
            type: 'confirm',
            confirmText: t('yes') as string,
            cancelText: t('no') as string,
        }).then(async (result) => {
            if (result) {
                const response = await item.restore();
                if (response) {
                    toastService.success(t('common.restored'));

                    macroService.doAction('repository_index_refresh');
                } else {
                    toastService.error(t('common.error'));
                }
            }
        });
    },

    forceDeleteItem: (item: Model) => {
        dialogService.create({
            title: t('table.actions.forceDelete.title') as string,
            message: t('table.actions.forceDelete.confirm'),
            type: 'confirm',
            confirmText: t('yes') as string,
            cancelText: t('no') as string,
        }).then(async (result) => {
            if (result) {
                const response = await item.forceDelete();
                if (response) {
                    toastService.success(t('common.deleted'));

                    macroService.doAction('repository_index_refresh');
                } else {
                    toastService.error(t('common.error'));
                }
            }
        });
    },

    deleteMass: (ids: number[], className: string) => {
        dialogService.create({
            title: t('table.actions.delete.title') as string,
            message: t('table.actions.delete.confirm'),
            type: 'confirm',
            confirmText: t('yes') as string,
            cancelText: t('no') as string,
        }).then(async (result) => {
            if (result) {

                const response = await axios({
                    url: route(`admin.${className}.massDelete`),
                    method: 'POST',
                    data: { ids },
                });

                if (response.status === 200) {
                    toastService.success(t('common.deleted'));

                    macroService.doAction('repository_index_refresh');
                } else {
                    toastService.error(t('common.error'));
                }
            }
        });
    },

    restoreMass: (ids: number[], className: string) => {
        dialogService.create({
            title: t('table.actions.restore.title') as string,
            message: t('table.actions.restore.confirm'),
            type: 'confirm',
            confirmText: t('yes') as string,
            cancelText: t('no') as string,
        }).then(async (result) => {
            if (result) {

                const response = await axios({
                    url: route(`admin.${className}.massRestore`),
                    method: 'POST',
                    data: { ids },
                });

                if (response.status === 200) {
                    toastService.success(t('common.restored'));

                    macroService.doAction('repository_index_refresh');
                } else {
                    toastService.error(t('common.error'));
                }
            }
        });
    },

    forceDeleteMass: (ids: number[], className: string) => {
        dialogService.create({
            title: t('table.actions.forceDelete.title') as string,
            message: t('table.actions.forceDelete.confirm'),
            type: 'confirm',
            confirmText: t('yes') as string,
            cancelText: t('no') as string,
        }).then(async (result) => {
            if (result) {

                const response = await axios({
                    url: route(`admin.${className}.massForceDelete`),
                    method: 'POST',
                    data: { ids },
                });

                if (response.status === 200) {
                    toastService.success(t('common.deleted'));

                    macroService.doAction('repository_index_refresh');
                } else {
                    toastService.error(t('common.error'));
                }
            }
        });
    },

    clickItem: (item: Model, { setSearchParams }: any) => {
        setSearchParams(() => {
            const { searchParams } = new URL(document.location.toString());
            searchParams.set('id', `${item.id}`);
            return searchParams;
        }, { replace: true });
    },

    newItem: (className: string, { setSearchParams }: any) => {
        setSearchParams(() => {
            const { searchParams } = new URL(document.location.toString());
            searchParams.set('id', '');
            return searchParams;
        }, { replace: true });
    },

    importItems: (className: string) => {
        dialogService.create({
            type: 'form',
            title: t('table.actions.import.title') as string,
            message: t('table.actions.import.file'),
            form: [
                {
                    type: 'file',
                    name: 'file',
                    inputProps: {
                        accept: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
                    },
                    required: true,
                }
            ],
            confirmText: t('common.submit') as string,
        }).then(async (result) => {
            if (!result) {
                return;
            }

            try {     
                const formData = new FormData();
                formData.append('file', result.file);

                console.log({ formData });

                const url = route(`admin.${className}.import`);

                const response = await axios({
                    url,
                    method: 'POST',
                    data: formData,
                });

                if (response.status === 200) {
                    toastService.success(
                        t(
                            'common.imported', 
                            {
                                created: response.data.created,
                                skipped: response.data.skipped
                            }
                        )
                    );
                    macroService.doAction('repository_index_refresh');
                }
            } catch (error: any) {
                if (error.response.status === 422) {
                    toastService.error(error.response.data.message);
                } else {
                    toastService.error(t('common.error'));
                }
                
            }
            
        });
    },

    exportItems: (className: string) => {
        dialogService.create({
            type: 'confirm',
            title: t('table.actions.export.title') as string,
            message: t('table.actions.export.confirm'),
            confirmText: t('yes') as string,
            cancelText: t('no') as string,
        }).then(async (result) => {
            if (result) {
                // const { searchParams } = new URL(document.location.toString());

                // const response = await model.export(searchParams, className);

                // if (response) {
                //     toastService.success(t('common.exported'));

                //     macroService.doAction('repository_index_refresh');
                // } else {
                //     toastService.error(t('common.error'));
                // }
            }
        });
    },
};
