import macroService from '../../internals/singletons/MacroService';
import dialogService from '../../internals/singletons/Dialog';
import toastService from '../../internals/singletons/Toast';

import t from '../../t';
import { Model } from '../../types/model';

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

    },

    restoreMass: (ids: number[], className: string) => {
    },

    forceDeleteMass: (ids: number[], className: string) => {
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
};
