
import { ModelConstructorAttributes, ModelMaker } from '../types/model';

import { BaseModel } from './BaseModel';

export default ({ modelRepository, className }: ModelMaker) => class Model extends BaseModel {

    constructor(attributes: ModelConstructorAttributes = { id: 0 }) {
        super(modelRepository, className, attributes);
    }

    /**
     * Obtém o nome da classe do modelo.
     *
     * @return {string} - Nome da classe do modelo.
     * @static
     */
    static getSchemaName() {
        return className;
    }

    /**
     * Obtém o schema da classe do modelo.
     *
     * @return {object} - Schema da classe do modelo.
     * @static
     */
    static getSchema() {
        return modelRepository.getClassSchema(className);
    }

}
