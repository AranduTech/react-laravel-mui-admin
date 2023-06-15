
import { Grid2Props } from "@mui/material";
import { BaseModel } from "../internals/BaseModel";
import { ModelRepository } from "../internals/singletons/ModelRepository";

export interface ModelMaker {
    modelRepository: ModelRepository,
    className: string,
}

export interface ModelSaveOptions {
    additionalPayload?: object,
    silent?: boolean,
    sendsOnlyModifiedFields?: boolean,
}

export interface ModelUseDataOptions {
    autoSave?: boolean,
}

export interface ModelAttributes {
    [key: string]: string | number | boolean | object | null | undefined,
}

export interface ModelConstructorAttributes {
    id?: number,
    created_at?: string,
    updated_at?: string,
    deleted_at?: string,
    [key: string]: string | number | boolean | object | null | undefined,
}
export type ModelSetAttributeCallback = (attributeName: string, value: any) => void;

export type ModelFillCallback = (data: object) => void;

export type ModelJsonCallback = () => object;

export type ModelDiffCallback = () => object | false;

export type ModelSaveCallback = (options?: ModelSaveOptions) => Promise<boolean>;

export type ModelUseDataCallback = (options?: ModelUseDataOptions) => [data: object, setData: (data: object) => void];

export interface ModelField {
    name: string,
    type?: 'label' | 'text' | 'email' | 'password' | 'tel' | 'number' | 'date' | 'checkbox' | 'radio' | 'select' | 'file' | 'textarea' | 'autocomplete',
    label?: string,
    initialValue?: any,
    required?: boolean,
    disabled?: boolean,
    options?: Array<any>,
    list?: string | {},
    multiline?: boolean,
    multiple?: boolean,
    rows?: number,
    labeledBy?: string,
    cached?: boolean,
    debounce?: number,
    _meta?: {
        model: string,
        schema: string,
    },
    gridItem?: Grid2Props,
}

export interface ModelTableColumnDefinition {
    key: string,
    label: string,
}

export interface ModelSchemaAttributes {
    fields: {
        [fieldSchema: string]: Array<ModelField>
    },
    fillable: string[],
    relations: {
        [relationName: string]: {
            model: string,
            type: 'HasOne' | 'HasMany' | 'BelongsTo' | 'BelongsToMany',
        }
    },
    tables: {
        [tableName: string]: Array<ModelTableColumnDefinition>
    },
    web: string[],
}

export interface ModelSchema {
    [className: string]: ModelSchemaAttributes;
}

export declare class Model extends BaseModel {
    constructor(attributes?: ModelConstructorAttributes);
    static getSchemaName(): string;
    static getSchema(): ModelSchemaAttributes;
    [key: string]: any,
}
