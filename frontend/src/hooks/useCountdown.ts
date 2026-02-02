import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseCountdownOptions {
    /**
     * Target date/time to count down to
     */
    targetDate: Date | string | null;

    /**
     * Callback when countdown reaches zero
     */
    onExpire?: () => void;

    /**
     * Update interval in milliseconds (default: 1000)
     */
    interval?: number;
}

export interface UseCountdownReturn {
    /**
     * Seconds remaining
     */
    timeLeft: number;

    /**
     * Formatted time string (MM:SS)
     */
    formattedTime: string;

    /**
     * Whether countdown has expired
     */
    isExpired: boolean;

    /**
     * Reset countdown with new target date
     */
    reset: (newTargetDate: Date | string) => void;
}

/**
 * Custom hook for countdown timer
 * @param options - Countdown configuration
 * @returns Countdown state and controls
 */
export const useCountdown = ({
    targetDate,
    onExpire,
    interval = 1000,
}: UseCountdownOptions): UseCountdownReturn => {
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isExpired, setIsExpired] = useState<boolean>(false);
    const onExpireRef = useRef(onExpire);

    // Keep onExpire callback ref up to date
    useEffect(() => {
        onExpireRef.current = onExpire;
    }, [onExpire]);

    const calculateTimeLeft = useCallback((target: Date | string): number => {
        const now = new Date().getTime();
        const expiry = new Date(target).getTime();
        const diff = Math.max(0, expiry - now);
        return Math.floor(diff / 1000);
    }, []);

    const reset = useCallback((newTargetDate: Date | string) => {
        setTimeLeft(calculateTimeLeft(newTargetDate));
        setIsExpired(false);
    }, [calculateTimeLeft]);

    useEffect(() => {
        if (!targetDate) {
            setTimeLeft(0);
            setIsExpired(false);
            return;
        }

        // Initial calculation
        const initialTime = calculateTimeLeft(targetDate);
        setTimeLeft(initialTime);
        setIsExpired(initialTime === 0);

        if (initialTime === 0) {
            onExpireRef.current?.();
            return;
        }

        // Set up interval
        const intervalId = setInterval(() => {
            const remaining = calculateTimeLeft(targetDate);
            setTimeLeft(remaining);

            if (remaining === 0) {
                setIsExpired(true);
                onExpireRef.current?.();
                clearInterval(intervalId);
            }
        }, interval);

        return () => clearInterval(intervalId);
    }, [targetDate, interval, calculateTimeLeft]);

    const formattedTime = useCallback(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, [timeLeft])();

    return {
        timeLeft,
        formattedTime,
        isExpired,
        reset,
    };
};
