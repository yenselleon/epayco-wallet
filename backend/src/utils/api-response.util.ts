export interface ApiResponse<T = any> {
    status: number;
    success: boolean;
    message: string;
    data: T | null;
}

export function successResponse<T>(
    data: T,
    message: string = 'Success',
    status: number = 200,
): ApiResponse<T> {
    return {
        status,
        success: true,
        message,
        data,
    };
}

export function errorResponse(
    message: string,
    status: number = 400,
): ApiResponse<null> {
    return {
        status,
        success: false,
        message,
        data: null,
    };
}
