import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { BalanceCard } from '../components/wallet/BalanceCard';
import { RechargeForm } from '../components/wallet/RechargeForm';
import PaymentModal from '../components/payment/PaymentModal';
import { TransactionHistory } from '../components/dashboard/TransactionHistory';
import { QuickActions } from '../components/dashboard/QuickActions';
import { StatsCards } from '../components/dashboard/StatsCards';
import { Button } from '../components/ui/Button';
import { getFirstName } from '../utils/formatters';
import styles from './DashboardPage.module.css';

export const DashboardPage = () => {
    const { user } = useAuth();
    const [refreshKey, setRefreshKey] = useState(0);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [currentBalance, setCurrentBalance] = useState(0);

    const handleRechargeSuccess = useCallback(() => {
        setRefreshKey(prev => prev + 1);
    }, []);

    const handleBalanceUpdate = useCallback((balance: number) => {
        setCurrentBalance(balance);
    }, []);

    const handlePaymentSuccess = useCallback((newBalance: number) => {
        setCurrentBalance(newBalance);
        setRefreshKey(prev => prev + 1);
    }, []);

    const handleOpenPaymentModal = useCallback(() => {
        setIsPaymentModalOpen(true);
    }, []);

    const handleClosePaymentModal = useCallback(() => {
        setIsPaymentModalOpen(false);
    }, []);

    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Dashboard</h1>
                    <p className={styles.subtitle}>
                        Bienvenido, <strong>{user?.name ? getFirstName(user.name) : 'Usuario'}</strong>
                    </p>
                </div>
            </div>

            <StatsCards />

            <div className={styles.mainGrid}>
                <div className={styles.leftColumn}>
                    <BalanceCard
                        key={refreshKey}
                        onBalanceLoad={handleBalanceUpdate}
                    />

                    <QuickActions />

                    <div className={styles.actionButtons}>
                        <Button
                            variant="primary"
                            onClick={handleOpenPaymentModal}
                            fullWidth
                        >
                            Retirar Saldo
                        </Button>
                    </div>
                </div>

                <div className={styles.rightColumn}>
                    <RechargeForm onSuccess={handleRechargeSuccess} />
                    <TransactionHistory />
                </div>
            </div>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={handleClosePaymentModal}
                currentBalance={currentBalance}
                onPaymentSuccess={handlePaymentSuccess}
            />
        </div>
    );
};
