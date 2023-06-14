
export type MacroActionCallback = (...params: any[]) => void;

export type MacroFilterCallback<T, U> = (value: T, ...params: any[]) => T | U;

export interface Action {
    action: string,
    callback: MacroActionCallback,
    priority: number,
}

export interface Filter<T, U> {
    filter: string,
    callback: MacroFilterCallback<T, U>,
    priority: number,
}

export type ActionRepository = Array<Action>;

export type FilterRepository<T, U> = Array<Filter<T, U>>;
