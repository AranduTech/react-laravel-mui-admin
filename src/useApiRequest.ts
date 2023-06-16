import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

export default <T = any>(options: AxiosRequestConfig) => {
    const {
        url,
        method = 'GET',
        ...axiosOptions
    } = options;

    const [response, setResult] = useState<T | null>(null);
    const [error, setError] = useState<object | null>(null);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios({
                    method,
                    url,
                    ...axiosOptions,
                });

                setResult(response.data);
            } catch (error: any) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, method]);

    useEffect(refresh, [refresh]);

    return {
        response, error, loading, refresh,
    };
};