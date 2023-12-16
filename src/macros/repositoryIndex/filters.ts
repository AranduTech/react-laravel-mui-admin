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
        className: string,
    ) => {
        const toBeAdded = [];

        const { 
            importable = false, exportable = false 
        } = modelRepository.getClassSchema(className);

        if (importable) {
            toBeAdded.push({
                label: `${t('common.import')} ${t(`models.${className}.plural`)}`,
                callback: () => doAction(
                    'repository_index_import_items',
                    className,
                )
            });
        }
        if (exportable) {
            toBeAdded.push({
                label: `${t('common.export')} ${t(`models.${className}.plural`)}`,
                callback: () => {
                    const { searchParams } = new URL(window.location.href);

                    const search = searchParams.toString();

                    doAction(
                        'repository_index_export_items',
                        className,
                        search,
                    );
                }
            });
        }

        return [
            ...opts,
            ...toBeAdded,
        ];
    },

    userCallHasRoleMethod: (previous: Function, user: Model) => (role: string|string[]) => {
        if (!user.relations.roles) {
            console.warn('User has no roles.');
            console.log({ user, role });
            return false;
        }
        if (Array.isArray(role)) {
            return (user.relations.roles as any[]).some((userRole: Model) => role.includes(userRole.name));
        }
        return (user.relations.roles as any[]).some((userRole: Model) => userRole.name === role);
    },

};

