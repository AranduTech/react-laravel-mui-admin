import React from 'react';

import ModelForm, { BaseModelFormProps } from './ModelForm';
import axios from 'axios';
import Skeleton from '@mui/material/Skeleton';
import { Model } from '../../types/model';

import { Grid2Props } from '@mui/material';
import useFetchItem from '../../useFetchItem';

export interface AsyncModelFormProps extends BaseModelFormProps {
    model: typeof Model;
    id?: number;
    fallback?: React.ReactElement;
    spacing?: Grid2Props['spacing'];
};

const AsyncModelForm = ({
    model: Model, id, fallback = <Skeleton height={300} />, ...props
}: AsyncModelFormProps) => {
    const { item, loading, error } = useFetchItem(Model, id, props.schema || 'default');

    if (loading) {
        return fallback;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <ModelForm
            item={item as Model}
            {...props}
        />
    );
};


export default AsyncModelForm;
