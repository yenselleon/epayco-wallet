import { Card } from '../ui/Card';
import { FaPaperPlane, FaQrcode, FaFileInvoiceDollar, FaHistory } from 'react-icons/fa';
import styles from './QuickActions.module.css';

interface QuickAction {
    id: string;
    icon: React.ReactNode;
    label: string;
    description: string;
    color: string;
}

const actions: QuickAction[] = [
    {
        id: 'send',
        icon: <FaPaperPlane />,
        label: 'Enviar Dinero',
        description: 'Transferir a otro usuario',
        color: 'var(--color-primary)'
    },
    {
        id: 'qr',
        icon: <FaQrcode />,
        label: 'Pagar con QR',
        description: 'Escanear código QR',
        color: 'var(--color-info)'
    },
    {
        id: 'bills',
        icon: <FaFileInvoiceDollar />,
        label: 'Pagar Servicios',
        description: 'Luz, agua, internet',
        color: 'var(--color-success)'
    },
    {
        id: 'history',
        icon: <FaHistory />,
        label: 'Historial',
        description: 'Ver movimientos',
        color: 'var(--color-warning)'
    },
];

export const QuickActions = () => {
    return (
        <Card title="Acciones Rápidas">
            <div className={styles.grid}>
                {actions.map((action) => (
                    <button
                        key={action.id}
                        className={styles.action}
                        style={{ '--action-color': action.color } as React.CSSProperties}
                    >
                        <div className={styles.iconWrapper}>
                            {action.icon}
                        </div>
                        <span className={styles.label}>{action.label}</span>
                        <span className={styles.description}>{action.description}</span>
                    </button>
                ))}
            </div>
        </Card>
    );
};
