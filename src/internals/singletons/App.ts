import axios from "axios";

import { AppConfiguration } from "../../types/config";

import registerConfig from "../registerConfig";
import setupLang from "../setupLang";
import { LaravelMuiAdminPlugin } from "../../types/plugin";

class App
{

    private plugins: LaravelMuiAdminPlugin[] = [];

    public runPlugins(): void
    {
        this.plugins.forEach((plugin) => {
            if (plugin.macros) {
                plugin.macros();
            }
        });
    }

    public withPlugins(plugins: LaravelMuiAdminPlugin[]): App
    {
        this.plugins = plugins;

        return this;
    }

    public async init(config: AppConfiguration): Promise<App>
    {

        const { data } = await axios.get('/api/admin/init');

        registerConfig({
            ...config,
            boot: {
                ...config.boot,
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

        return this;
    }
}

const app = new App();

export default app;
