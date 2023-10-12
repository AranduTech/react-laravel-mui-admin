import { LangConfiguration } from "./lang";
import { ModelSchema } from "./model";

export interface AppConfiguration {
    lang?: LangConfiguration;
    boot: {
        data: {
            user: any,
            [key: string]: any,
        },
        models: ModelSchema,
        routes: {
            [routeName: string]: string,
        },
    },
    [key: string]: any;
}
