import { ReactNode } from "react";
import { RouteObject } from "react-router-dom";

export type RouteReplacer = false | { [key: string]: string | number };

export type RouteRegistrator = (action: string, className: string) => RouteObject | ReactNode;

export interface RouteRegistrationMixins {
    [className: string]: RouteRegistrator
}
