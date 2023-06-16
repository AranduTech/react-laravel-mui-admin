import macros from './internals/singletons/MacroService';

import repositoryIndexFilters from './macros/repositoryIndex/filters';
import repositoryIndexActions from './macros/repositoryIndex/actions';

export default () => {
    // Add trashed tab to index page
    macros.addFilter(
        'repository_index_tabs',
        repositoryIndexFilters.addTrashedTab,
        99,
    );

    // Add delete/restore actions to models
    macros.addFilter(
        'repository_index_get_mass_actions',
        repositoryIndexFilters.addMassDeleteAndRestoreActions,
        1,
    );
    macros.addFilter(
        'repository_index_get_item_actions',
        repositoryIndexFilters.addItemDeleteAndRestoreActions,
    );
    macros.addAction(
        'repository_index_item_action_delete',
        repositoryIndexActions.deleteItem,
    );
    macros.addAction(
        'repository_index_item_action_restore',
        repositoryIndexActions.restoreItem,
    );
    macros.addAction(
        'repository_index_item_action_forceDelete',
        repositoryIndexActions.forceDeleteItem,
    );

    macros.addAction(
        'repository_index_mass_action_delete',
        repositoryIndexActions.deleteMass,
    );
    macros.addAction(
        'repository_index_mass_action_restore',
        repositoryIndexActions.restoreMass,
    );
    macros.addAction(
        'repository_index_mass_action_forceDelete',
        repositoryIndexActions.forceDeleteMass,
    );
    macros.addAction(
        'repository_index_click_item',
        repositoryIndexActions.clickItem,
    );
    macros.addAction(
        'repository_index_new_item',
        repositoryIndexActions.newItem,
    );
};

