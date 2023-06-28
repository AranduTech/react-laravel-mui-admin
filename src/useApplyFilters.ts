import React from 'react';
import applyFilters from './applyFilters';

/**
 * UseApplyFilters.
 *
 * @param  filter - Nome do filtro.
 * @param  value - Valor a ser filtrado.
 * @param args - Argumentos do filtro.
 * @return  - Valor filtrado.
 */
const useApplyFilters = (filter: string, value: any, ...args: any[]) => React.useMemo(
    () => applyFilters(filter, value, ...args),
    [filter, value, ...args],
);

export default useApplyFilters;