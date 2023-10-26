import axios from 'axios';
import { dotAccessor } from './support/object';
import { AppConfiguration } from './types/config';
import registerConfig from './internals/registerConfig';
import setupLang from './internals/setupLang';

let appDefinition: null | object = null;

const app = {
    init: async (config: AppConfiguration) => {

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

        /**
         * Echo exposes an expressive API for subscribing to channels and listening
         * for events that are broadcast by Laravel. Echo and event broadcasting
         * allows your team to easily build robust real-time web applications.
         */

        // import Echo from 'laravel-echo';

        // window.Pusher = require('pusher-js');

        // window.Echo = new Echo({
        //     broadcaster: 'pusher',
        //     key: process.env.MIX_PUSHER_APP_KEY,
        //     cluster: process.env.MIX_PUSHER_APP_CLUSTER,
        //     forceTLS: true
        // });
    },

    /** @deprecated */
    getDefinition: (path: string) => dotAccessor(appDefinition, path),
};

export default app;

