export const DATA_SOURCE = 'DATA_SOURCE';

export const REPOSITORIES = {
    CLIENT: 'CLIENT_REPOSITORY',
    TRANSACTION_SESSION: 'TRANSACTION_SESSION_REPOSITORY',
} as const;

export const TRANSACTION_STATUS = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
} as const;

export const HTTP_MESSAGES = {
    CLIENT_NOT_FOUND: 'Client not found',
    CLIENT_ALREADY_EXISTS: 'Client already exists',
    EMAIL_ALREADY_EXISTS: 'Email already exists',
    INSUFFICIENT_BALANCE: 'Insufficient balance',
    INVALID_TOKEN: 'Invalid token',
    SESSION_EXPIRED: 'Session expired',
    SESSION_NOT_FOUND: 'Session not found',
    PAYMENT_SUCCESS: 'Payment processed successfully',
} as const;
