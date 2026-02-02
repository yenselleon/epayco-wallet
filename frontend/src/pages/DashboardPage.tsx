import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BalanceCard } from '../components/wallet/BalanceCard';
import { RechargeForm } from '../components/wallet/RechargeForm';
import PaymentModal from '../components/payment/PaymentModal';
import { Button } from '../components/ui/Button';
import styles from './DashboardPage.module.css';

export const DashboardPage = () => {
    const { user } = useAuth();
    const [refreshKey, setRefreshKey] = useState(0);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [currentBalance, setCurrentBalance] = useState(0);

    const handleRechargeSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    const handleBalanceUpdate = (balance: number) => {
        setCurrentBalance(balance);
    };

    const handlePaymentSuccess = (newBalance: number) => {
        setCurrentBalance(newBalance);
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <h1 className={styles.title}>Dashboard</h1>
                <p className={styles.subtitle}>
                    Bienvenido, <strong>{user?.name || user?.document}</strong>
                </p>
            </div>

            <div className={styles.grid}>
                <div className={styles.balanceSection}>
                    <BalanceCard
                        key={refreshKey}
                        onBalanceLoad={handleBalanceUpdate}
                    />
                </div>

                <div className={styles.rechargeSection}>
                    <RechargeForm onSuccess={handleRechargeSuccess} />
                </div>
            </div>

            <div className={styles.paymentSection}>
                <Button
                    variant="primary"
                    onClick={() => setIsPaymentModalOpen(true)}
                    className={styles.paymentButton}
                >
                    Retirar Saldo
                </Button>
            </div>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                currentBalance={currentBalance}
                onPaymentSuccess={handlePaymentSuccess}
            />
        </div>
    );
};
