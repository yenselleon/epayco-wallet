import api from './api';
import type { EnvelopeResponse } from './api';

export interface PaymentRequestResponse {
    sessionId: string;
    message: string;
    expiresAt: string;
}

export interface PaymentConfirmResponse {
    message: string;
    newBalance: number;
    transactionId: string;
    amount: number;
}

export const requestPayment = async (document: string, phone: string, amount: number): Promise<PaymentRequestResponse> => {
    const response = await api.post<EnvelopeResponse<PaymentRequestResponse>>('/payment/request', {
        document,
        phone,
        amount
    });
    return response.data.data;
};

export const confirmPayment = async (sessionId: string, token: string): Promise<PaymentConfirmResponse> => {
    const response = await api.post<EnvelopeResponse<PaymentConfirmResponse>>('/payment/confirm', {
        sessionId,
        token
    });
    return response.data.data;
};
