import { GlobalResponse } from "@/common/interfaces/global.interface";

/**
 * @deprecated Este archivo está deprecado. 
 * Los controllers ahora retornan { message, data } directamente.
 * El ResponseInterceptor se encarga de envolver las respuestas.
 * 
 * Este archivo se mantiene temporalmente para compatibilidad,
 * pero será eliminado en futuras versiones.
 */

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
