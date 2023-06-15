import React from 'react';

import { MacroActionCallback } from './types/macro';

import addAction from './addAction';
import removeAction from './removeAction';
import doAction from './doAction';

/**
 * UseAddAction.
 *
 * Recebe uma ação e um callback e adiciona o callback na fila
 * de execução da ação. O callback é executado quando a ação
 * for disparada. A ação é removida da fila quando o componente
 * é desmontado.
 *
 * @param action - Nome da ação.
 * @param callback - Callback a ser executado.
 * @param priority - Prioridade da ação. Quanto menor o número, maior a prioridade.
 * @return - Função que dispara a ação.
 */
export default (action: string, callback: MacroActionCallback, priority = 10) => {
    React.useEffect(() => {
        addAction(action, callback, priority);
        return () => {
            removeAction(action, callback);
        };
    }, [action, callback, priority]);

    return (...args: any[]) => doAction(action, ...args);
};