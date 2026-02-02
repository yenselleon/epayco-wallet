import { GlobalResponse } from "@/common/interfaces/global.interface";



export function successResponse<T>(
    data: T,
    message: string = 'Success',
    status: number = 200,
): GlobalResponse<T> {
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
): GlobalResponse<null> {
    return {
        status,
        success: false,
        message,
        data: null,
    };
}
