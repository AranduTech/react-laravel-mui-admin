import { ActionRepository, FilterRepository, MacroActionCallback, MacroFilterCallback } from "../../types/macro";

/**
 * Service for macro.
 */
class MacroService {

    // add_action, add_filter, do_action, apply_filters

    #actions: ActionRepository = [];
    #filters: FilterRepository<any, any> = [];

    /**
     * Adiciona uma ação para ser executada.
     *
     * @param {string} action - Nome da ação.
     * @param {Function} callback - Função a ser executada.
     * @param {number} priority - Prioridade da ação.
     */
    addAction(action: string, callback: MacroActionCallback, priority: number = 10) {
        this.#actions.push({ action, callback, priority });
    }

    /**
     * Adiciona um filtro para ser executado.
     *
     * @param {string} filter - Nome do filtro.
     * @param {Function} callback - Função a ser executada.
     * @param {number} priority - Prioridade do filtro.
     */
    addFilter<T, U>(filter: string, callback: MacroFilterCallback<T, U>, priority: number = 10) {
        this.#filters.push({ filter, callback, priority });
    }

    /**
     * Executa as ações registradas.
     *
     * @param {string} action - Nome da ação.
     * @param {any} args - Argumentos da ação.
     * @return {void} - Resultado da ação.
     */
    doAction(action: string, ...args: any[]): void {
        const actions = this.#actions.filter((item) => item.action === action);
        actions.sort((a, b) => a.priority - b.priority);
        actions.forEach((item) => item.callback(...args));
    }

    /**
     * Executa os filtros registrados.
     *
     * @param {string} filter - Nome do filtro.
     * @param {any} value - Valor a ser filtrado.
     * @param {any} args - Argumentos do filtro.
     * @return {any} - Valor filtrado.
     */
    applyFilters(filter: string, value: any, ...args: any[]): any {
        const filters = this.#filters.filter((item) => item.filter === filter);
        // filters;
        return filters
            .sort((a, b) => a.priority - b.priority)
            .reduce((value, item) => item.callback(value, ...args), value);
    }

    /**
     * Remove uma ação.
     *
     * @param {string} action - Nome da ação.
     * @param {Function} callback - Função a ser removida.
     */
    removeAction(action: string, callback: MacroActionCallback) {
        this.#actions = this.#actions.filter((item) => item.action !== action || item.callback !== callback);
    }

    /**
     * Remove um filtro.
     *
     * @param {string} filter - Nome do filtro.
     * @param {Function} callback - Função a ser removida.
     */
    removeFilter(filter: string, callback: MacroFilterCallback<any, any>) {
        this.#filters = this.#filters.filter((item) => item.filter !== filter || item.callback !== callback);
    }

    /**
     * Retorna as ações registradas.
     *
     * @return {Array} - Ações registradas.
     */
    getActions(): Array<any> {
        return this.#actions;
    }

    /**
     * Retorna os filtros registrados.
     *
     * @return {Array} - Filtros registrados.
     */
    getFilters(filter?: string): Array<any> {
        if (filter) {
            return this.#filters.filter((item) => item.filter === filter);
        }
        return this.#filters;
    }

    hasFilter(filter: string): boolean {
        return this.#filters.some((item) => item.filter === filter);
    }

    hasAction(action: string): boolean {
        return this.#actions.some((item) => item.action === action);
    }

}

const macros = new MacroService();

export default macros;

