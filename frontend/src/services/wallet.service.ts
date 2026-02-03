import api from './api';
import type { EnvelopeResponse } from './api';

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

export const rechargeWallet = async (data: RechargeWalletDto): Promise<{ balance: number }> => {
    const response = await api.post<EnvelopeResponse<{ balance: number }>>('/wallet/recharge', data);
    return response.data.data;
};

export const getBalance = async (document: string, phone: string): Promise<BalanceResponse> => {
    const response = await api.get<EnvelopeResponse<BalanceResponse>>('/wallet/balance', {
        params: { document, phone },
    });
    return response.data.data;
};
