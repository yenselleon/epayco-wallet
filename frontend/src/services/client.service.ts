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

export const registerClient = async (data: CreateClientDto): Promise<ClientResponse> => {
    const response = await api.post<EnvelopeResponse<ClientResponse>>('/clients', data);
    return response.data.data;
};
