import { dotAccessor } from '../../support/object';

import { AppConfiguration } from '../../types/config';

/**
 * MUI App Core.
 */
class Config {

    private appConfiguration: AppConfiguration;

    constructor() {
        this.appConfiguration = {};
    }

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
     * @return {any} A configuração.
     */
    config(path: string) {
        return dotAccessor(this.appConfiguration, path);
    }

}

const configInstance = new Config();

export default configInstance;