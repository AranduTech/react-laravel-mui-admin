import React from 'react';

import { Model as ModelClass } from './types/model';
import axios from 'axios';
import route from './route';
import modelRepository from './modelRepository';

export default (Model: typeof ModelClass, id?: number, schema = 'default') => {

    const [item, setItem] = React.useState<ModelClass | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<any>(null);

    React.useEffect(() => {
        if (id) {
            setLoading(true);
            axios(route(`admin.${Model.getSchemaName()}.item`, { id }))
                .then((response) => {
                    setError(null);
                    setItem(new Model(response.data));
                })
                .catch((error) => {
                    setError(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setItem(modelRepository.createEmptyModelInstance(Model.getSchemaName()));
        }
    }, [id]);


    return {
        item,
        loading: loading || !item,
        error,
    };

};
