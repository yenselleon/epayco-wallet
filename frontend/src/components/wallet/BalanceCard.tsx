import { useState, useEffect } from 'react';
import { FaWallet, FaSync } from 'react-icons/fa';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { getBalance } from '../../services/wallet.service';
import { useAuth } from '../../context/AuthContext';
import styles from './BalanceCard.module.css';

export const BalanceCard = () => {
    const { user } = useAuth();
    const [balance, setBalance] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchBalance = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const data = await getBalance({ document: user.document, phone: user.phone });
            console.log('💰 Balance Data:', data);
            setBalance(Number(data.balance));
        } catch (error) {
            console.error('❌ Error fetching balance:', error);
            setBalance(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBalance();
    }, [user]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(value);
    };

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
                onClick={fetchBalance}
                isLoading={isLoading}
                className={styles.refreshButton}
            >
                <FaSync /> Actualizar
            </Button>
        </Card>
    );
};
