import { z } from 'zod';

/**
 * Validation constants
 */
export const VALIDATION_RULES = {
    DOCUMENT: {
        MIN_LENGTH: 6,
        PATTERN: /^\d+$/,
    },
    PHONE: {
        MIN_LENGTH: 10,
        PATTERN: /^\d+$/,
    },
    AMOUNT: {
        MIN: 1,
        MAX: 10000000,
    },
    TOKEN: {
        LENGTH: 6,
        PATTERN: /^\d{6}$/,
    },
} as const;

/**
 * Validation error messages
 */
export const VALIDATION_MESSAGES = {
    DOCUMENT: {
        REQUIRED: 'El documento es requerido',
        MIN_LENGTH: `El documento debe tener al menos ${VALIDATION_RULES.DOCUMENT.MIN_LENGTH} caracteres`,
        PATTERN: 'El documento debe contener solo números',
    },
    PHONE: {
        REQUIRED: 'El teléfono es requerido',
        MIN_LENGTH: `El teléfono debe tener al menos ${VALIDATION_RULES.PHONE.MIN_LENGTH} dígitos`,
        PATTERN: 'El teléfono debe contener solo números',
    },
    AMOUNT: {
        REQUIRED: 'El monto es requerido',
        MIN: `El monto mínimo es $${VALIDATION_RULES.AMOUNT.MIN}`,
        MAX: `El monto máximo es $${VALIDATION_RULES.AMOUNT.MAX.toLocaleString()}`,
    },
    TOKEN: {
        REQUIRED: 'El token es requerido',
        LENGTH: `El token debe tener exactamente ${VALIDATION_RULES.TOKEN.LENGTH} dígitos`,
        PATTERN: 'El token debe contener solo números',
    },
} as const;

/**
 * Reusable Zod schemas
 */
export const documentSchema = z.string()
    .min(VALIDATION_RULES.DOCUMENT.MIN_LENGTH, VALIDATION_MESSAGES.DOCUMENT.MIN_LENGTH)
    .regex(VALIDATION_RULES.DOCUMENT.PATTERN, VALIDATION_MESSAGES.DOCUMENT.PATTERN);

export const phoneSchema = z.string()
    .min(VALIDATION_RULES.PHONE.MIN_LENGTH, VALIDATION_MESSAGES.PHONE.MIN_LENGTH)
    .regex(VALIDATION_RULES.PHONE.PATTERN, VALIDATION_MESSAGES.PHONE.PATTERN);

export const amountSchema = z.number()
    .min(VALIDATION_RULES.AMOUNT.MIN, VALIDATION_MESSAGES.AMOUNT.MIN)
    .max(VALIDATION_RULES.AMOUNT.MAX, VALIDATION_MESSAGES.AMOUNT.MAX);

export const tokenSchema = z.string()
    .length(VALIDATION_RULES.TOKEN.LENGTH, VALIDATION_MESSAGES.TOKEN.LENGTH)
    .regex(VALIDATION_RULES.TOKEN.PATTERN, VALIDATION_MESSAGES.TOKEN.PATTERN);

/**
 * Combined schemas for common use cases
 */
export const loginSchema = z.object({
    document: documentSchema,
    phone: phoneSchema,
});

export const rechargeSchema = z.object({
    amount: amountSchema,
});

export const paymentRequestSchema = z.object({
    amount: amountSchema,
});

export const paymentConfirmSchema = z.object({
    token: tokenSchema,
});
