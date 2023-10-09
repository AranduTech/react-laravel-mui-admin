
## Actions


## Filters

#### `'repository_index_${className}_column_${columnKey}_data'` 
Filtra a exibição do valor de uma coluna da tabela de listagem de registros. Recebe como parâmetros o valor da coluna e o registro completo.

#### `'repository_index_tabs'` 
Filtra as abas da tela de listagem de registros. Recebe como parâmetro um array com as abas e um objeto com `className` e uma função `setQuery` para modificar a query.

Exemplo:

```js
macros.addFilter('repository_index_tabs', (tabs, { className, setQuery }) => {
    const newTabs = [...tabs];

    if (className === 'user') {
        newTabs.push({
            name: 'admin',
            label: t('roles.admin'),
            onEnter: () => {
                setQuery((query) => ({
                    ...query,
                    admin: true,
                }));
            },
            onLeave: () => {
                setQuery((query) => {
                    // eslint-disable-next-line no-unused-vars
                    const { admin, ...newQuery } = query;

                    return newQuery;
                });
            },
        });
    }

    return newTabs;
});
```

#### `'repository_index_actions'`

Filtra as ações da tela de listagem de registros. Recebe como parâmetro um array com as ações e o `className`.