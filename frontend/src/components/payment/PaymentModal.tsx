import { usePaymentFlow } from '../../hooks/usePaymentFlow';
import { useAuth } from '../../context/AuthContext';
import { useCountdown } from '../../hooks/useCountdown';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { formatNumber } from '../../utils/formatters';
import styles from './PaymentModal.module.css';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentBalance: number;
    onPaymentSuccess: (newBalance: number) => void;
}

export default function PaymentModal({
    isOpen,
    onClose,
    currentBalance,
    onPaymentSuccess,
}: PaymentModalProps) {
    const { user } = useAuth(); // Import useAuth to get current user data

    const {
        step,
        document,
        phone,
        setDocument,
        setPhone,
        amount,
        expiresAt,
        token,
        isRequestingPayment,
        isConfirmingPayment,
        setAmount,
        setToken,
        handleRequestPayment,
        handleConfirmPayment,
        resetFlow,
    } = usePaymentFlow({
        currentBalance,
        onPaymentSuccess,
        userDocument: user?.document,
        userPhone: user?.phone
    });

    const { formattedTime, timeLeft } = useCountdown({
        targetDate: expiresAt || null,
        onExpire: () => {
            // The hook already handles the expiration in usePaymentFlow
        },
    });

    const handleClose = () => {
        resetFlow();
        onClose();
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
                            Saldo disponible: <strong>${formatNumber(currentBalance)}</strong>
                        </p>

                        <form onSubmit={handleRequestPayment} className={styles.form}>
                            <Input
                                label="Documento"
                                placeholder="Ej: 1234567890"
                                value={document}
                                onChange={(e) => setDocument(e.target.value)}
                                required
                                disabled={isRequestingPayment}
                            />
                            <Input
                                label="Celular"
                                placeholder="Ej: 3001234567"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                disabled={isRequestingPayment}
                            />
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
                        <h2 className={styles.title}>🔐 Confirmar Retiro</h2>

                        <div className={styles.confirmInfo}>
                            <p className={styles.emailSent}>✉️ Token enviado a tu correo</p>
                            <p className={styles.amountInfo}>
                                Monto: <strong>${formatNumber(Number(amount))}</strong>
                            </p>
                            {timeLeft > 0 && (
                                <p className={styles.timer}>
                                    ⏱️ Expira en: <strong>{formattedTime}</strong>
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
