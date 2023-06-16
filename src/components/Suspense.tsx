import React from 'react';

import Loading from './Loading';

export interface SuspenseProps {
    children: React.ElementType;
}

const Suspense = ({ children: Component }: SuspenseProps) => (
    <React.Suspense fallback={<Loading />}>
        <Component />
    </React.Suspense>
);

export default Suspense;
