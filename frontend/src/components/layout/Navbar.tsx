import { Link, useNavigate } from 'react-router-dom';
import { FaWallet, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';

export const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    <FaWallet className={styles.icon} />
                    <span className={styles.brand}>ePayco Wallet</span>
                </Link>

                <div className={styles.menu}>
                    {isAuthenticated ? (
                        <>
                            <div className={styles.userInfo}>
                                <FaUserCircle />
                                <span className={styles.username}>{user?.name || user?.document}</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLogout}
                                aria-label="Cerrar sesión"
                            >
                                <FaSignOutAlt />
                            </Button>
                        </>
                    ) : (
                        <div className={styles.authButtons}>
                            <Link to="/login">
                                <Button variant="ghost" size="sm">Iniciar Sesión</Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="primary" size="sm">Regístrate</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};
