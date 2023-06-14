import { LangConfiguration } from "./lang";

export interface AppConfiguration {
    lang?: LangConfiguration;
    [key: string]: any;
}
