import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { requestPayment, confirmPayment } from '../../services/payment.service';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import styles from './PaymentModal.module.css';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentBalance: number;
    onPaymentSuccess: (newBalance: number) => void;
}

type PaymentStep = 'request' | 'confirm';

export default function PaymentModal({
    isOpen,
    onClose,
    currentBalance,
    onPaymentSuccess,
}: PaymentModalProps) {
    const { user } = useAuth();

    const [step, setStep] = useState<PaymentStep>('request');
    const [amount, setAmount] = useState<string>('');
    const [sessionId, setSessionId] = useState<string>('');
    const [expiresAt, setExpiresAt] = useState<string>('');
    const [token, setToken] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState<number>(0);

    const [isRequestingPayment, setIsRequestingPayment] = useState(false);
    const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);

    useEffect(() => {
        if (!expiresAt) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const expiry = new Date(expiresAt).getTime();
            const diff = Math.max(0, expiry - now);
            setTimeLeft(Math.floor(diff / 1000));

            if (diff === 0) {
                toast.error('El token ha expirado. Solicita un nuevo pago.');
                resetFlow();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt]);

    const resetFlow = () => {
        setStep('request');
        setAmount('');
        setSessionId('');
        setExpiresAt('');
        setToken('');
        setTimeLeft(0);
    };

    const handleClose = () => {
        resetFlow();
        onClose();
    };

    const handleRequestPayment = async (e: React.FormEvent) => {
        e.preventDefault();

        const amountNum = Number(amount);

        if (amountNum < 1) {
            toast.error('El monto mínimo es $1');
            return;
        }

        if (amountNum > 10000000) {
            toast.error('El monto máximo es $10,000,000');
            return;
        }

        if (amountNum > currentBalance) {
            toast.error('Saldo insuficiente para realizar este pago');
            return;
        }

        if (!user) {
            toast.error('Debes iniciar sesión');
            return;
        }

        setIsRequestingPayment(true);

        try {
            const response = await requestPayment({
                document: user.document,
                phone: user.phone,
                amount: amountNum,
            });

            setSessionId(response.sessionId);
            setExpiresAt(response.expiresAt);
            setStep('confirm');
            toast.success('Token enviado a tu correo. Revisa tu bandeja de entrada.');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al solicitar el pago';
            toast.error(message);
        } finally {
            setIsRequestingPayment(false);
        }
    };

    const handleConfirmPayment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (token.length !== 6 || !/^\d{6}$/.test(token)) {
            toast.error('El token debe tener exactamente 6 dígitos');
            return;
        }

        setIsConfirmingPayment(true);

        try {
            const response = await confirmPayment({
                sessionId,
                token,
            });

            toast.success(`Pago exitoso. Nuevo saldo: $${response.newBalance.toLocaleString()}`);
            onPaymentSuccess(response.newBalance);
            handleClose();
        } catch (error: any) {
            const status = error.response?.status;
            const message = error.response?.data?.message;

            switch (status) {
                case 400:
                    if (message?.includes('expirado')) {
                        toast.error('El token ha expirado. Solicita un nuevo pago.');
                        resetFlow();
                    } else if (message?.includes('insuficiente')) {
                        toast.error('Saldo insuficiente para completar el pago.');
                    } else {
                        toast.error(message || 'Error en la solicitud');
                    }
                    break;
                case 401:
                    toast.error('Token inválido. Verifica el código enviado a tu email.');
                    setToken('');
                    break;
                case 404:
                    toast.error('Sesión no encontrada. Solicita un nuevo pago.');
                    resetFlow();
                    break;
                case 409:
                    toast.error('Esta transacción ya fue procesada.');
                    handleClose();
                    break;
                default:
                    toast.error('Ocurrió un error inesperado. Intenta nuevamente.');
            }
        } finally {
            setIsConfirmingPayment(false);
        }
    };

    const formatTimeLeft = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={handleClose}>
                    ✕
                </button>

                {step === 'request' ? (
                    <>
                        <h2 className={styles.title}>Retirar Saldo</h2>
                        <p className={styles.balance}>
                            Saldo disponible: <strong>${currentBalance.toLocaleString()}</strong>
                        </p>

                        <form onSubmit={handleRequestPayment} className={styles.form}>
                            <Input
                                label="Monto a pagar"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Ingresa el monto"
                                required
                                min="1"
                                max="10000000"
                                disabled={isRequestingPayment}
                            />

                            <div className={styles.actions}>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleClose}
                                    disabled={isRequestingPayment}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isRequestingPayment}
                                    isLoading={isRequestingPayment}
                                >
                                    Solicitar Retiro →
                                </Button>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <h2 className={styles.title}>🔐 Confirmar Pago</h2>

                        <div className={styles.confirmInfo}>
                            <p className={styles.emailSent}>✉️ Token enviado a tu correo</p>
                            <p className={styles.amountInfo}>
                                Monto: <strong>${Number(amount).toLocaleString()}</strong>
                            </p>
                            {timeLeft > 0 && (
                                <p className={styles.timer}>
                                    ⏱️ Expira en: <strong>{formatTimeLeft()}</strong>
                                </p>
                            )}
                        </div>

                        <form onSubmit={handleConfirmPayment} className={styles.form}>
                            <Input
                                label="Código de 6 dígitos"
                                type="text"
                                value={token}
                                onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                required
                                maxLength={6}
                                disabled={isConfirmingPayment}
                                autoFocus
                            />

                            <div className={styles.actions}>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={resetFlow}
                                    disabled={isConfirmingPayment}
                                >
                                    ← Volver
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isConfirmingPayment || token.length !== 6}
                                    isLoading={isConfirmingPayment}
                                >
                                    Confirmar Retiro
                                </Button>
                            </div>

                            <p className={styles.helpText}>
                                ¿No recibiste el código?{' '}
                                <button
                                    type="button"
                                    className={styles.linkButton}
                                    onClick={resetFlow}
                                    disabled={isConfirmingPayment}
                                >
                                    Solicitar nuevo código
                                </button>
                            </p>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
