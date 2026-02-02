import { useState, useEffect, useCallback } from 'react';
import { getBalance } from '../services/wallet.service';
import type { ApiError } from '../types/api';
import { toApiError } from '../types/api';

export interface UseWalletBalanceOptions {
    /**
     * User document number
     */
    document?: string;

    /**
     * User phone number
     */
    phone?: string;

    /**
     * Whether to fetch balance automatically on mount
     */
    autoFetch?: boolean;

    /**
     * Callback when balance is loaded
     */
    onBalanceLoad?: (balance: number) => void;
}

export interface UseWalletBalanceReturn {
    /**
     * Current balance
     */
    balance: number | null;

    /**
     * User's full name
     */
    name: string | null;

    /**
     * Loading state
     */
    isLoading: boolean;

    /**
     * Error state
     */
    error: ApiError | null;

    /**
     * Manually refresh balance
     */
    refresh: () => Promise<void>;

    /**
     * Update balance locally (optimistic update)
     */
    updateBalance: (newBalance: number) => void;
}

/**
 * Custom hook for managing wallet balance
 * @param options - Configuration options
 * @returns Balance state and controls
 */
export const useWalletBalance = ({
    document,
    phone,
    autoFetch = true,
    onBalanceLoad,
}: UseWalletBalanceOptions): UseWalletBalanceReturn => {
    const [balance, setBalance] = useState<number | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);

    const fetchBalance = useCallback(async () => {
        if (!document || !phone) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await getBalance({ document, phone });
            setBalance(data.balance);
            setName(data.name);
            onBalanceLoad?.(data.balance);
        } catch (err) {
            const apiError = toApiError(err);
            setError(apiError);
        } finally {
            setIsLoading(false);
        }
    }, [document, phone, onBalanceLoad]);

    const updateBalance = useCallback((newBalance: number) => {
        setBalance(newBalance);
    }, []);

    useEffect(() => {
        if (autoFetch && document && phone) {
            fetchBalance();
        }
    }, [autoFetch, document, phone, fetchBalance]);

    return {
        balance,
        name,
        isLoading,
        error,
        refresh: fetchBalance,
        updateBalance,
    };
};
