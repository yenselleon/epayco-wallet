import api from './api';
import type { EnvelopeResponse } from './api';

export interface GetBalanceDto {
    document: string;
    phone: string;
}

export interface RechargeWalletDto {
    document: string;
    phone: string;
    amount: number;
}

export interface BalanceResponse {
    balance: number;
    document: string;
    name: string;
}

export interface RechargeResponse {
    message: string;
    balance: number;
}

export const getBalance = async (params: GetBalanceDto): Promise<BalanceResponse> => {
    const response = await api.get<EnvelopeResponse<BalanceResponse>>('/wallet/balance', { params });
    return response.data.data;
};

export const rechargeWallet = async (data: RechargeWalletDto): Promise<RechargeResponse> => {
    const response = await api.post<EnvelopeResponse<RechargeResponse>>('/wallet/recharge', data);
    return response.data.data;
};
