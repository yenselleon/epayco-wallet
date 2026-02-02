import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { requestPayment, confirmPayment } from '../services/payment.service';
import { toApiError } from '../types/api';
import { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants';
import { VALIDATION_RULES } from '../utils/validations';

export type PaymentStep = 'request' | 'confirm';

export interface UsePaymentFlowOptions {
    /**
     * User document number
     */
    document: string;

    /**
     * User phone number
     */
    phone: string;

    /**
     * Current wallet balance
     */
    currentBalance: number;

    /**
     * Callback when payment is successful
     */
    onPaymentSuccess: (newBalance: number) => void;
}

export interface UsePaymentFlowReturn {
    /**
     * Current step in the payment flow
     */
    step: PaymentStep;

    /**
     * Payment amount
     */
    amount: string;

    /**
     * Session ID from payment request
     */
    sessionId: string;

    /**
     * Token expiration date
     */
    expiresAt: string;

    /**
     * Confirmation token
     */
    token: string;

    /**
     * Loading state for payment request
     */
    isRequestingPayment: boolean;

    /**
     * Loading state for payment confirmation
     */
    isConfirmingPayment: boolean;

    /**
     * Set amount
     */
    setAmount: (amount: string) => void;

    /**
     * Set token
     */
    setToken: (token: string) => void;

    /**
     * Request payment (step 1)
     */
    handleRequestPayment: (e: React.FormEvent) => Promise<void>;

    /**
     * Confirm payment (step 2)
     */
    handleConfirmPayment: (e: React.FormEvent) => Promise<void>;

    /**
     * Reset flow to initial state
     */
    resetFlow: () => void;
}

/**
 * Custom hook for managing the 2-step payment flow
 * @param options - Configuration options
 * @returns Payment flow state and controls
 */
export const usePaymentFlow = ({
    document,
    phone,
    currentBalance,
    onPaymentSuccess,
}: UsePaymentFlowOptions): UsePaymentFlowReturn => {
    const [step, setStep] = useState<PaymentStep>('request');
    const [amount, setAmount] = useState<string>('');
    const [sessionId, setSessionId] = useState<string>('');
    const [expiresAt, setExpiresAt] = useState<string>('');
    const [token, setToken] = useState<string>('');
    const [isRequestingPayment, setIsRequestingPayment] = useState(false);
    const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);

    const resetFlow = useCallback(() => {
        setStep('request');
        setAmount('');
        setSessionId('');
        setExpiresAt('');
        setToken('');
    }, []);

    const handleRequestPayment = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        const amountNum = Number(amount);

        // Validations
        if (amountNum < VALIDATION_RULES.AMOUNT.MIN) {
            toast.error(`El monto mínimo es $${VALIDATION_RULES.AMOUNT.MIN}`);
            return;
        }

        if (amountNum > VALIDATION_RULES.AMOUNT.MAX) {
            toast.error(`El monto máximo es $${VALIDATION_RULES.AMOUNT.MAX.toLocaleString()}`);
            return;
        }

        if (amountNum > currentBalance) {
            toast.error(ERROR_MESSAGES.INSUFFICIENT_BALANCE);
            return;
        }

        setIsRequestingPayment(true);

        try {
            const response = await requestPayment({
                document,
                phone,
                amount: amountNum,
            });

            setSessionId(response.sessionId);
            setExpiresAt(response.expiresAt);
            setStep('confirm');
            toast.success(SUCCESS_MESSAGES.TOKEN_SENT);
        } catch (err) {
            const error = toApiError(err);
            toast.error(error.message || 'Error al solicitar el pago');
        } finally {
            setIsRequestingPayment(false);
        }
    }, [amount, currentBalance, document, phone]);

    const handleConfirmPayment = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate token
        if (!VALIDATION_RULES.TOKEN.PATTERN.test(token)) {
            toast.error(`El token debe tener exactamente ${VALIDATION_RULES.TOKEN.LENGTH} dígitos`);
            return;
        }

        setIsConfirmingPayment(true);

        try {
            const response = await confirmPayment({
                sessionId,
                token,
            });

            toast.success(SUCCESS_MESSAGES.PAYMENT(response.newBalance));
            onPaymentSuccess(response.newBalance);
            resetFlow();
        } catch (err: any) {
            const status = err.response?.status;
            const message = err.response?.data?.message;

            switch (status) {
                case HTTP_STATUS.BAD_REQUEST:
                    if (message?.includes('expirado')) {
                        toast.error(ERROR_MESSAGES.EXPIRED_TOKEN);
                        resetFlow();
                    } else if (message?.includes('insuficiente')) {
                        toast.error(ERROR_MESSAGES.INSUFFICIENT_BALANCE);
                    } else {
                        toast.error(message || 'Error en la solicitud');
                    }
                    break;
                case HTTP_STATUS.UNAUTHORIZED:
                    toast.error(ERROR_MESSAGES.INVALID_TOKEN);
                    setToken('');
                    break;
                case HTTP_STATUS.NOT_FOUND:
                    toast.error(ERROR_MESSAGES.SESSION_NOT_FOUND);
                    resetFlow();
                    break;
                case HTTP_STATUS.CONFLICT:
                    toast.error(ERROR_MESSAGES.TRANSACTION_ALREADY_PROCESSED);
                    resetFlow();
                    break;
                default:
                    toast.error(ERROR_MESSAGES.GENERIC);
            }
        } finally {
            setIsConfirmingPayment(false);
        }
    }, [sessionId, token, onPaymentSuccess, resetFlow]);

    return {
        step,
        amount,
        sessionId,
        expiresAt,
        token,
        isRequestingPayment,
        isConfirmingPayment,
        setAmount,
        setToken,
        handleRequestPayment,
        handleConfirmPayment,
        resetFlow,
    };
};
