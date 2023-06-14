import { RouteReplacer } from "./types/route";

const route = (name: string, replace: RouteReplacer = false) => {
    const el = document.getElementById(`route-data-${name}`);

    if (!el) {
        // eslint-disable-next-line no-console
        console.warn(`Route data was not found. Make sure '${name}' 
is a valid route name in your routes file. Also check if you have
'React' service injected in your controller, and passed to this route.
\`\`\`php
public function showPage(\\App\\Services\\React $react) {
    return view('view-name')->with(['react' => $react])
}
\`\`\`
If you are trying to check if a route exists, use 'route.exists("${name}")' instead.`);
        throw new Error(`Route data for '${name}' was not found.`);
    }

    const { dataset } = el;

    let { value: url } = dataset;

    if (!url) {
        throw new Error(`Route data for '${name}' was not found.`);
    }

    // Remove leading and trailing slashes
    url = url.replace(/^\/|\/$/g, '');

    const regex = /{([^}]+)}/g;
    const matches = url.match(regex);
    const params = matches ? matches.map((match) => match.slice(1, -1)) : [];

    if (replace === false) {
        return `/${url.replace(regex, ':$1')}`;
    }

    const replaceKeys = Object.keys(replace);
    const missingParams = params.filter((param) => !replaceKeys.includes(param));
    const extraParams = replaceKeys.filter((key) => !params.includes(key));

    if (missingParams.length > 0) {
        throw new Error(`Missing values for parameter(s): ${missingParams.join(', ')}`);
    }

    if (extraParams.length > 0) {
        throw new Error(`Unexpected parameters: ${extraParams.join(', ')}`);
    }

    const newPath = params.reduce((acc, param) => acc.replace(`{${param}}`, `${replace[param]}`), url);

    return `/${newPath}`;
};

route.exists = (name: string) => !!document.getElementById(`route-data-${name}`);

export default route;
