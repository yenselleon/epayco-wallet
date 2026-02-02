import { FaArrowUp, FaArrowDown, FaExchangeAlt } from 'react-icons/fa';
import styles from './StatsCards.module.css';

interface Stat {
    id: string;
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down' | 'neutral';
    icon: React.ReactNode;
}

const stats: Stat[] = [
    {
        id: 'income',
        label: 'Ingresos del mes',
        value: '$250,000',
        change: '+12.5%',
        trend: 'up',
        icon: <FaArrowUp />
    },
    {
        id: 'expenses',
        label: 'Gastos del mes',
        value: '$180,000',
        change: '-5.2%',
        trend: 'down',
        icon: <FaArrowDown />
    },
    {
        id: 'transactions',
        label: 'Transacciones',
        value: '24',
        change: '+8',
        trend: 'neutral',
        icon: <FaExchangeAlt />
    },
];

export const StatsCards = () => {
    return (
        <div className={styles.grid}>
            {stats.map((stat) => (
                <div key={stat.id} className={styles.card}>
                    <div className={styles.header}>
                        <span className={styles.label}>{stat.label}</span>
                        <div className={`${styles.icon} ${styles[stat.trend]}`}>
                            {stat.icon}
                        </div>
                    </div>

                    <div className={styles.value}>{stat.value}</div>

                    <div className={`${styles.change} ${styles[stat.trend]}`}>
                        {stat.change} vs mes anterior
                    </div>
                </div>
            ))}
        </div>
    );
};
