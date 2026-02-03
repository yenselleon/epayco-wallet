import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthLayout } from '../layouts/AuthLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { loginSchema } from '../utils/validations';
import { getFirstName } from '../utils/formatters';
import { SUCCESS_MESSAGES, ROUTES, HTTP_STATUS } from '../utils/constants';
import type { z } from 'zod';

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        try {
            const { loginClient } = await import('../services/client.service');
            const response = await loginClient(data.document, data.phone);

            localStorage.setItem('access_token', response.access_token);
            login(response.user.document, response.user.phone, response.user.name);

            toast.success(SUCCESS_MESSAGES.LOGIN(getFirstName(response.user.name)));
            navigate(ROUTES.DASHBOARD);
        } catch (error: any) {
            if (error.response?.status === HTTP_STATUS.NOT_FOUND || error.response?.status === 401) {
                toast.error('Credenciales inválidas. Verifica tus datos.');
            } else {
                toast.error('Error al iniciar sesión');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <Card title="Iniciar Sesión" subtitle="Ingresa tus credenciales para acceder">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <Input
                        label="Documento"
                        placeholder="Ej: 1234567890"
                        error={errors.document?.message}
                        {...register('document')}
                    />

                    <Input
                        label="Celular"
                        placeholder="Ej: 3001234567"
                        error={errors.phone?.message}
                        {...register('phone')}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        isLoading={isLoading}
                        variant="primary"
                    >
                        Ingresar
                    </Button>

                    <div className="text-center text-sm text-gray-500 mt-4">
                        ¿No tienes cuenta?{' '}
                        <Link to={ROUTES.REGISTER} className="text-orange-600 font-medium hover:underline">
                            Regístrate aquí
                        </Link>
                    </div>
                </form>
            </Card>
        </AuthLayout>
    );
};
