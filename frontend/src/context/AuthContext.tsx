import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { AUTH_CONFIG } from '../utils/constants';

export interface AuthUser {
    document: string;
    phone: string;
    name?: string;
}

interface AuthContextType {
    user: AuthUser | null;
    login: (document: string, phone: string, name?: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(() => {
        const stored = localStorage.getItem(AUTH_CONFIG.STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch {
                localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY);
                return null;
            }
        }
        return null;
    });

    const login = useCallback((document: string, phone: string, name?: string) => {
        const authUser: AuthUser = { document, phone, name };
        setUser(authUser);
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEY, JSON.stringify(authUser));
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY);
    }, []);

    const value = useMemo(
        () => ({
            user,
            login,
            logout,
            isAuthenticated: !!user,
        }),
        [user, login, logout]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};
