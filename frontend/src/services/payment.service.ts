import api from './api';
import type { EnvelopeResponse } from './api';


export interface PaymentRequestData {
    document: string;
    phone: string;
    amount: number;
}

export interface PaymentRequestResponse {
    sessionId: string;
    message: string;
    expiresAt: string;
}

export interface PaymentConfirmData {
    sessionId: string;
    token: string;
}

export interface PaymentConfirmResponse {
    message: string;
    newBalance: number;
    transactionId: string;
    amount: number;
}


export const requestPayment = async (
    data: PaymentRequestData
): Promise<PaymentRequestResponse> => {
    const response = await api.post<EnvelopeResponse<PaymentRequestResponse>>(
        '/payment/request',
        data
    );
    return response.data.data;
};


export const confirmPayment = async (
    data: PaymentConfirmData
): Promise<PaymentConfirmResponse> => {
    const response = await api.post<EnvelopeResponse<PaymentConfirmResponse>>(
        '/payment/confirm',
        data
    );
    return response.data.data;
};
