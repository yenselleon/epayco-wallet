import api from './api';
import type { EnvelopeResponse } from './api';

export interface CreateClientDto {
    document: string;
    name: string;
    email: string;
    phone: string;
}

export interface ClientResponse {
    id: string;
    document: string;
    name: string;
    email: string;
    phone: string;
    balance: number;
}

export interface ClientData {
    document: string;
    phone: string;
    name: string;
    email: string;
    balance: number;
}

export interface LoginResponse {
    access_token: string;
    user: {
        document: string;
        phone: string;
        name: string;
    };
}

export const registerClient = async (data: CreateClientDto): Promise<ClientResponse> => {
    const response = await api.post<EnvelopeResponse<ClientResponse>>('/clients', data);
    return response.data.data;
};

export const loginClient = async (document: string, phone: string): Promise<LoginResponse> => {
    const response = await api.post<EnvelopeResponse<LoginResponse>>('/clients/login', {
        document,
        phone
    });
    return response.data.data;
};

export const getClientByDocument = async (document: string, phone: string): Promise<ClientData> => {
    const response = await api.get<EnvelopeResponse<ClientData>>('/wallet/balance', {
        params: { document, phone }
    });
    return response.data.data;
};
