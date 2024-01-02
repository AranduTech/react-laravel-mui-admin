import React from 'react';
import modelRepository from './modelRepository';

export default function useModels(models: string[]) {
    return React.useMemo(() => models.map(model => modelRepository.getModelClass(model)), [...models]);
}

