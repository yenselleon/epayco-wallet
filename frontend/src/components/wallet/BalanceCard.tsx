import { FaWallet, FaSync } from 'react-icons/fa';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useWalletBalance } from '../../hooks/useWalletBalance';
import { formatCurrency } from '../../utils/formatters';
import styles from './BalanceCard.module.css';

interface BalanceCardProps {
    onBalanceLoad?: (balance: number) => void;
}

export const BalanceCard = ({ onBalanceLoad }: BalanceCardProps) => {
    const { user } = useAuth();
    const { balance, isLoading, refresh } = useWalletBalance({
        autoFetch: true,
        userDocument: user?.document,
        userPhone: user?.phone,
        onBalanceLoad,
    });

    return (
        <Card className={styles.balanceCard}>
            <div className={styles.header}>
                <div className={styles.iconWrapper}>
                    <FaWallet className={styles.icon} />
                </div>
                <div className={styles.info}>
                    <span className={styles.label}>Saldo Disponible</span>
                    {balance !== null ? (
                        <span className={styles.amount}>{formatCurrency(balance)}</span>
                    ) : (
                        <span className={styles.loading}>Cargando...</span>
                    )}
                </div>
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={refresh}
                isLoading={isLoading}
                className={styles.refreshButton}
            >
                <FaSync /> Actualizar
            </Button>
        </Card>
    );
};
