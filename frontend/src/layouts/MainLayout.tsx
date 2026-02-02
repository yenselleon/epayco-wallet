import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import styles from './MainLayout.module.css';

export const MainLayout = () => {
    return (
        <div className={styles.wrapper}>
            <Navbar />
            <main className={styles.main}>
                <div className={styles.container}>
                    <Outlet />
                </div>
            </main>
            <footer className={styles.footer}>
                <div className={styles.container}>
                    <p>© {new Date().getFullYear()} ePayco Wallet. Prueba Técnica.</p>
                </div>
            </footer>
        </div>
    );
};
