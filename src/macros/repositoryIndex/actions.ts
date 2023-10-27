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
                if (error.response?.status === 422) {

                    const { response } = error;

                    const msg = `${response.data.message}`
                        + '\n\n'
                        + Object.keys(response.data.errors)
                            .map((prop) => `${prop}: ${response.data.errors[prop].join(' ')}`)
                            .join('\n');

                    toastService.error(msg);
                } else {
                    toastService.error(t('common.error'));
                }
                
            }
            
        });
    },

    exportItems: (className: string, search: string) => {
        dialogService.create({
            type: 'confirm',
            title: t('table.actions.export.title') as string,
            message: t('table.actions.export.confirm'),
            confirmText: t('yes') as string,
            cancelText: t('no') as string,
        }).then(async (result) => {
            if (result) {
                // const { searchParams } = new URL(document.location.toString());]

                const response = await axios(`${route(`admin.${className}.export`)}?${search}`, {
                    responseType: 'blob',
                });

                const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

                /**
                 * Convert your blob into a Blob URL
                 * (a special url that points to an object in the browser's memory)
                 */
                const blobUrl = URL.createObjectURL(blob);

                // Create a link element
                const link = document.createElement('a');

                // Set link's href to point to the Blob URL
                link.href = blobUrl;
                link.download = `${className}.xlsx`;

                // Append link to the body
                document.body.appendChild(link);

                // Dispatch click event on the link
                // This is necessary as link.click() does not work on the latest firefox
                link.dispatchEvent(new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                }));

                // Remove link from body
                document.body.removeChild(link);

            }
        });
    },
};
