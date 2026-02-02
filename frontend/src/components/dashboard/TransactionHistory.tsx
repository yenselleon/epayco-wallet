import { Card } from '../ui/Card';
import { FaArrowUp, FaArrowDown, FaExchangeAlt } from 'react-icons/fa';
import styles from './TransactionHistory.module.css';

interface Transaction {
    id: string;
    type: 'recharge' | 'payment' | 'transfer';
    amount: number;
    description: string;
    date: string;
    status: 'completed' | 'pending' | 'failed';
}

const fakeTransactions: Transaction[] = [
    {
        id: '1',
        type: 'recharge',
        amount: 100000,
        description: 'Recarga de saldo',
        date: '2024-02-02 14:30',
        status: 'completed'
    },
    {
        id: '2',
        type: 'payment',
        amount: 50000,
        description: 'Pago en Amazon',
        date: '2024-02-02 12:15',
        status: 'completed'
    },
    {
        id: '3',
        type: 'transfer',
        amount: 25000,
        description: 'Transferencia a Juan',
        date: '2024-02-01 18:45',
        status: 'completed'
    },
    {
        id: '4',
        type: 'payment',
        amount: 15000,
        description: 'Pago en Rappi',
        date: '2024-02-01 10:20',
        status: 'pending'
    },
];

export const TransactionHistory = () => {
    const getIcon = (type: Transaction['type']) => {
        switch (type) {
            case 'recharge':
                return <FaArrowDown className={styles.iconRecharge} />;
            case 'payment':
                return <FaArrowUp className={styles.iconPayment} />;
            case 'transfer':
                return <FaExchangeAlt className={styles.iconTransfer} />;
        }
    };

    return (
        <Card title="Historial de Transacciones" subtitle="Últimas operaciones">
            <div className={styles.list}>
                {fakeTransactions.map((tx) => (
                    <div key={tx.id} className={styles.transaction}>
                        <div className={styles.iconWrapper}>
                            {getIcon(tx.type)}
                        </div>

                        <div className={styles.details}>
                            <span className={styles.description}>{tx.description}</span>
                            <span className={styles.date}>{tx.date}</span>
                        </div>

                        <div className={styles.amountWrapper}>
                            <span className={`${styles.amount} ${styles[tx.type]}`}>
                                {tx.type === 'recharge' ? '+' : '-'}${tx.amount.toLocaleString()}
                            </span>
                            <span className={`${styles.status} ${styles[tx.status]}`}>
                                {tx.status === 'completed' ? 'Completado' : 'Pendiente'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <button className={styles.viewAll}>
                Ver todas las transacciones →
            </button>
        </Card>
    );
};
