import { ActionItem } from '../../components/RepositoryIndex/ActionButton';
import modelRepository from '../../internals/singletons/ModelRepository';

import t from '../../t';
import { Model } from '../../types/model';

import doAction from '../../doAction';

export default {

    addTrashedTab: (tabs: any[], className: string) => {
        const newTabs = [...tabs];

        const { softDelete } = modelRepository.getClassSchema(className);

        if (softDelete) {
            newTabs.push({
                name: 'trashed',
                label: t('table.trashed'),
            });
        }

        return newTabs;
    },

    addItemDeleteAndRestoreActions: (actions: ActionItem[], item: Model) => {
        const newActions = [...actions];

        const { softDelete } = (item.constructor as typeof Model).getSchema();

        if (softDelete && item.deletedAt) {
            newActions.push({
                name: 'restore',
                label: t('common.restore'),
                icon: 'restore',
            });

            newActions.push({
                name: 'forceDelete',
                label: t('common.deleteForever'),
                icon: 'delete',
            });

            return newActions;
        }

        newActions.push({
            name: 'delete',
            label: softDelete
                ? t('common.softDelete')
                : t('common.deleteForever'),
            icon: 'delete',
        });

        return newActions;
    },

    addMassDeleteAndRestoreActions: (actions: ActionItem[], className: string, tab: string) => {
        const newActions = [...actions];

        const { softDelete } = modelRepository.getClassSchema(className);

        if (softDelete && tab === 'trashed') {
            newActions.push({
                name: 'restore',
                label: t('common.restore'),
            });

            newActions.push({
                name: 'forceDelete',
                label: t('common.deleteForever'),
            });

            return newActions;
        }

        newActions.push({
            name: 'delete',
            label: softDelete
                ? t('common.softDelete')
                : t('common.deleteForever'),
        });

        return newActions;
    },

    addModelImportExport: (
        opts: any[],
        model: Model,
        className: string,
        { importable, exportable }: any
    ) => {
        if (importable) {
            opts.push({
                label: t('common.import'),
                callback: () => doAction(
                    'repository_index_import_items',
                    model,
                    className,
                )
            });
        }
        if (exportable) {
            opts.push({
                label: t('common.export'),
                callback: () => doAction(
                    'repository_index_export_items',
                    model,
                    className,
                )
            });
        }

        return opts;
    },

};

