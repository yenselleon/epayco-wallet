import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

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

const AUTH_STORAGE_KEY = 'epayco_auth_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(() => {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch {
                localStorage.removeItem(AUTH_STORAGE_KEY);
                return null;
            }
        }
        return null;
    });

    const login = (document: string, phone: string, name?: string) => {
        const authUser: AuthUser = { document, phone, name };
        setUser(authUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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
