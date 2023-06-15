import React from 'react';

import error from './error';

/**
 * Limpa os erros de navegação ao sair do componente,
 * quando utilizando navegação por SPA.
 */
export default () => {
    React.useEffect(() => () => error.clear(), []);
};
