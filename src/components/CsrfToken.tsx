import React from 'react';

const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

const CsrfToken = () => (
    <input
        type="hidden"
        name="_token"
        value={CSRF_TOKEN || ''}
    />
);

export default CsrfToken;
