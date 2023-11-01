import { dotAccessor } from '../../support/object';

import { AppConfiguration } from '../../types/config';

/**
 * MUI App Core.
 */
class Config {

    private appConfiguration?: AppConfiguration;

    /**
     * Registra a configuração do projeto.
     *
     * @param {object} config - A configuração do projeto.
     */
    registerConfig(appConfiguration: AppConfiguration) {
        this.appConfiguration = appConfiguration;
    }

    /**
     * Obtém uma configuração do projeto.
     *
     * @param {string} path - O caminho da configuração.
     * @param {any} defaultValue - O valor padrão.
     * @return {any} A configuração.
     */
    config(path: string, defaultValue?: any) {
        const value = dotAccessor(this.appConfiguration, path);

        if (value === undefined) {
            return defaultValue;
        }

        return value;
    }

}

const configInstance = new Config();

export default configInstance;