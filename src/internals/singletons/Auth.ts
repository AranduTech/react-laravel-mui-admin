import React from 'react';

// import Model from '../contracts/Model';
// import dialog from '../dialog';
import modelRepository from './ModelRepository';
import { Model } from '../../types/model';

import app from '../../app';
import config from '../../config';

/**
 * Classe para gerenciar a autenticação do usuário.
 */
class Auth {

    #user?: Model;

    /**
     * Método para fazer o logout do usuário.
     *
     */
    logout() {  
        (document.querySelector('form#logout-form') as HTMLFormElement)?.submit();
    }

    /**
     * Método para retornar o usuário autenticado.
     *
     * @return - Instância de Model do usuário autenticado.
     */
    getCurrentUser(): Model {
        if (!this.#user) {
            const Model = modelRepository.getModelClass('user');
            const userData = config('boot.data.user');
            this.#user = new Model(userData);
        }
        return this.#user;
    }
}

const authController = new Auth();

export default authController;