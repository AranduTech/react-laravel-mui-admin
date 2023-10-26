import config from "./config";

import { RouteReplacer } from "./types/route";

const route = (name: string, replace: RouteReplacer = false) => {

    const routes = config('boot.routes');

    let { [name]: url } = routes;

    if (!url) {
        throw new Error(`Route data for '${name}' was not found.`);
    }

    // Remove leading and trailing slashes
    url = url.replace(/^\/|\/$/g, '');

    const regex = /{([^}]+)}/g;
    const matches = url.match(regex);
    const params = matches ? matches.map((match: string) => match.slice(1, -1)) : [];

    if (replace === false) {
        return `/${url.replace(regex, ':$1')}`;
    }

    const replaceKeys = Object.keys(replace);
    const missingParams = params.filter((param: string) => !replaceKeys.includes(param));
    const extraParams = replaceKeys.filter((key) => !params.includes(key));

    if (missingParams.length > 0) {
        throw new Error(`Missing values for parameter(s): ${missingParams.join(', ')}`);
    }

    if (extraParams.length > 0) {
        throw new Error(`Unexpected parameters: ${extraParams.join(', ')}`);
    }

    const newPath = params.reduce((acc: string, param: string) => acc.replace(`{${param}}`, `${replace[param]}`), url);

    return `/${newPath}`;
};

route.exists = (name: string) => !!config('boot.routes')[name];

export default route;
