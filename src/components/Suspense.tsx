import React from 'react';

export interface SuspenseProps {
    children: React.ElementType;
}


const Suspense = ({ children: Component }: SuspenseProps) => (
    <React.Suspense fallback={<div>Carregando...</div>}>
        <Component />
    </React.Suspense>
);

// const Suspense = ({ children: Component }: SuspenseProps) => (
//     <React.Suspense fallback={<Loading />}>
//         <Component />
//     </React.Suspense>
// );

export default Suspense;
