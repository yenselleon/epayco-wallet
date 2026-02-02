import type { AxiosError } from 'axios';

/**
 * Standard API envelope response structure
 */
export interface EnvelopeResponse<T = any> {
    status: number;
    success: boolean;
    message: string;
    data: T;
    error: boolean;
}

/**
 * API Error structure
 */
export interface ApiError {
    message: string;
    status?: number;
    originalError?: AxiosError<EnvelopeResponse>;
}

/**
 * Type guard to check if error is ApiError
 */
export const isApiError = (error: unknown): error is ApiError => {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as ApiError).message === 'string'
    );
};

/**
 * Helper to create ApiError from unknown error
 */
export const toApiError = (error: unknown): ApiError => {
    if (isApiError(error)) {
        return error;
    }

    if (error instanceof Error) {
        return {
            message: error.message,
        };
    }

    return {
        message: 'An unknown error occurred',
    };
};
