/**
 * Application-wide constants
 */

/**
 * API Configuration
 */
export const API_CONFIG = {
    TIMEOUT: 10000,
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
} as const;

/**
 * Authentication
 */
export const AUTH_CONFIG = {
    STORAGE_KEY: 'epayco_auth_user',
} as const;

/**
 * Validation limits
 */
export const LIMITS = {
    AMOUNT: {
        MIN: 1,
        MAX: 10000000,
    },
    DOCUMENT: {
        MIN_LENGTH: 6,
    },
    PHONE: {
        MIN_LENGTH: 10,
    },
    TOKEN: {
        LENGTH: 6,
        EXPIRY_SECONDS: 300, // 5 minutes
    },
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
    GENERIC: 'Ocurrió un error inesperado',
    SERVER_ERROR: 'Error de servidor. Intenta más tarde.',
    NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
    UNAUTHORIZED: 'No autorizado. Inicia sesión nuevamente.',
    NOT_FOUND: 'Recurso no encontrado',
    INSUFFICIENT_BALANCE: 'Saldo insuficiente',
    INVALID_TOKEN: 'Token inválido',
    EXPIRED_TOKEN: 'El token ha expirado',
    SESSION_NOT_FOUND: 'Sesión no encontrada',
    TRANSACTION_ALREADY_PROCESSED: 'Esta transacción ya fue procesada',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
    LOGIN: (name: string) => `¡Bienvenido, ${name}!`,
    REGISTRATION: 'Registro exitoso. ¡Bienvenido!',
    RECHARGE: (balance: string) => `Recarga exitosa. Nuevo saldo: ${balance}`,
    PAYMENT: (balance: number) => `Pago exitoso. Nuevo saldo: $${balance.toLocaleString()}`,
    TOKEN_SENT: 'Token enviado a tu correo. Revisa tu bandeja de entrada.',
} as const;

/**
 * Routes
 */
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
} as const;

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
} as const;
