import type { ReactNode } from 'react';
import { FaShieldAlt, FaBolt, FaCheckCircle } from 'react-icons/fa';
import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
    children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div className={styles.container}>
            {/* Left Side: Branding */}
            <div className={styles.brandingSide}>
                <div className={styles.brandingContent}>
                    <div className={styles.logo}>
                        <h1 className={styles.logoText}>ePayco Wallet</h1>
                    </div>

                    <h2 className={styles.tagline}>
                        Tu billetera digital <span className={styles.highlight}>segura y rápida</span>
                    </h2>

                    <ul className={styles.features}>
                        <li className={styles.feature}>
                            <FaBolt className={styles.featureIcon} />
                            <span>Transacciones instantáneas</span>
                        </li>
                        <li className={styles.feature}>
                            <FaShieldAlt className={styles.featureIcon} />
                            <span>Seguridad de nivel bancario</span>
                        </li>
                        <li className={styles.feature}>
                            <FaCheckCircle className={styles.featureIcon} />
                            <span>Confirmación con token OTP</span>
                        </li>
                    </ul>

                    <div className={styles.stats}>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>10K+</span>
                            <span className={styles.statLabel}>Usuarios</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>$50M+</span>
                            <span className={styles.statLabel}>Transacciones</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>99.9%</span>
                            <span className={styles.statLabel}>Uptime</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className={styles.formSide}>
                <div className={styles.formContainer}>
                    {children}
                </div>
            </div>
        </div>
    );
};
