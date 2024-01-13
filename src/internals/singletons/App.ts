import axios from "axios";

import { AppConfiguration } from "../../types/config";

import registerConfig from "../registerConfig";
import setupLang from "../setupLang";
import { LaravelMuiAdminPlugin } from "../../types/plugin";
import { RouteObject, RouterProviderProps, createBrowserRouter } from "react-router-dom";
import runCoreMacros from "../runCoreMacros";
import { Theme, createTheme } from "@mui/material";
import macros from "./MacroService";

type Router = RouterProviderProps['router'];

class App
{

    private plugins: LaravelMuiAdminPlugin[] = [];
    private config?: AppConfiguration;
    private macros: () => void = () => void 0;
    private routeLoader: () => RouteObject[] = () => [];

    get router(): Router
    {
        return createBrowserRouter(this.routeLoader());
    }

    get theme(): Theme
    {
        const args = macros.applyFilters('app_create_theme_args', []);

        return createTheme(this.config?.theme || {}, ...args);
    }

    public runPlugins(): void
    {
        const debug = !!this.config?.app?.debug;
        if (debug) {
            console.log('Running plugins...');
        }
        this.plugins.forEach((plugin) => {
            if (plugin.macros) {
                if (debug) {
                    console.log('Running plugin', plugin);
                }
                plugin.macros();
            }
        });
    }

    public withPlugins(plugins: LaravelMuiAdminPlugin[]): App
    {
        this.plugins = plugins;

        return this;
    }

    public withConfig(config: AppConfiguration): App
    {
        this.config = config;

        return this;
    }

    public withMacros(macros: () => void): App
    {
        this.macros = macros;

        return this;
    }

    public withRoutes(routeLoader: () => RouteObject[]): App
    {
        this.routeLoader = routeLoader;

        return this;
    }

    public async init(): Promise<App>
    {

        const { data } = await axios.get('/api/admin/init');

        registerConfig({
            ...this.config,
            boot: {
                ...this.config?.boot,
                ...data,
            },
        });

        setupLang();


        /**
         * We'll load the axios HTTP library which allows us to easily issue requests
         * to our Laravel back-end. This library automatically handles sending the
         * CSRF token as a header based on the value of the "XSRF" token cookie.
         */
        axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

        axios.defaults.withCredentials = true;

        runCoreMacros();

        this.runPlugins();

        this.macros();

        return this;
    }
}

const app = new App();

export default app;
