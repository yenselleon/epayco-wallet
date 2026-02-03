import { useState, useEffect, useCallback } from 'react';
import { getBalance } from '../services/wallet.service';
import type { ApiError } from '../types/api';
import { toApiError } from '../types/api';

export interface UseWalletBalanceOptions {
    autoFetch?: boolean;
    onBalanceLoad?: (balance: number) => void;
}

export interface UseWalletBalanceReturn {
    balance: number | null;
    name: string | null;
    isLoading: boolean;
    error: ApiError | null;
    refresh: () => Promise<void>;
    updateBalance: (newBalance: number) => void;
}

export const useWalletBalance = ({
    autoFetch = true,
    userDocument,
    userPhone,
    onBalanceLoad,
}: UseWalletBalanceOptions & {
    userDocument?: string;
    userPhone?: string;
} = {}): UseWalletBalanceReturn => {
    const [balance, setBalance] = useState<number | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);

    const fetchBalance = useCallback(async () => {
        if (!userDocument || !userPhone) return;

        setIsLoading(true);
        setError(null);

        try {
            const data = await getBalance(userDocument, userPhone);
            setBalance(data.balance);
            setName(data.name);
            onBalanceLoad?.(data.balance);
        } catch (err) {
            const apiError = toApiError(err);
            setError(apiError);
        } finally {
            setIsLoading(false);
        }
    }, [userDocument, userPhone, onBalanceLoad]);

    const updateBalance = useCallback((newBalance: number) => {
        setBalance(newBalance);
    }, []);

    useEffect(() => {
        if (autoFetch && userDocument && userPhone) {
            fetchBalance();
        }
    }, [autoFetch, userDocument, userPhone, fetchBalance]);

    return {
        balance,
        name,
        isLoading,
        error,
        refresh: fetchBalance,
        updateBalance,
    };
};
