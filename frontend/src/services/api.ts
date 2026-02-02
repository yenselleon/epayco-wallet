import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

export interface EnvelopeResponse<T = any> {
    status: number;
    success: boolean;
    message: string;
    data: T;
    error: boolean;
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response: AxiosResponse<EnvelopeResponse>) => {
        if (response.data.success === false) {
            toast.error(response.data.message || 'Error en la operación');
            return Promise.reject(new Error(response.data.message));
        }

        return response;
    },
    (error: AxiosError<EnvelopeResponse>) => {
        const message = error.response?.data?.message || 'Ocurrió un error inesperado';

        if (!error.response || error.response.status >= 500) {
            toast.error('Error de servidor. Intenta más tarde.');
        }

        return Promise.reject({
            message,
            status: error.response?.status,
            originalError: error
        });
    }
);

export default api;
