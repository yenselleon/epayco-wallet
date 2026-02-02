import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BalanceCard } from '../components/wallet/BalanceCard';
import { RechargeForm } from '../components/wallet/RechargeForm';
import styles from './DashboardPage.module.css';

export const DashboardPage = () => {
    const { user } = useAuth();
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRechargeSuccess = () => {
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
                    <BalanceCard key={refreshKey} />
                </div>

                <div className={styles.rechargeSection}>
                    <RechargeForm onSuccess={handleRechargeSuccess} />
                </div>
            </div>
        </div>
    );
};
