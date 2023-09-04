import React from 'react';

import ModelForm, { BaseModelFormProps } from './ModelForm';
import axios from 'axios';
import Skeleton from '@mui/material/Skeleton';

import modelRepository from '../../internals/singletons/ModelRepository';
import { Model } from '../../types/model';
import route from '../../route';
import { Grid2Props } from '@mui/material';

export interface AsyncModelFormProps extends BaseModelFormProps {
    model: typeof Model;
    id?: number;
    fallback?: React.ReactElement;
    spacing?: Grid2Props['spacing'];
};

const AsyncModelForm = ({
    model: Model, id, fallback = <Skeleton height={300} />, ...props
}: AsyncModelFormProps) => {
    const [item, setItem] = React.useState<Model | null>(null);

    React.useEffect(() => {
        if (id) {
            axios(route(`admin.${Model.getSchemaName()}.item`, { id })).then((response) => {
                setItem(new Model(response.data));
            });
        } else {
            setItem(modelRepository.createEmptyModelInstance(Model.getSchemaName(), props.schema || 'default'));
        }
    }, [Model, id, props.schema]);

    if (item === null) {
        return fallback;
    }

    return (
        <ModelForm
            item={item}
            {...props}
        />
    );
};


export default AsyncModelForm;
