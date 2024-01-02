import React from 'react';
import modelRepository from './modelRepository';

export default function useModel(model: string) {
    return React.useMemo(() => modelRepository.getModelClass(model), [model]);
}

