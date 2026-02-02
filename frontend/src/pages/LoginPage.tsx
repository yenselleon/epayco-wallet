import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

const loginSchema = z.object({
    document: z.string()
        .min(6, 'El documento debe tener al menos 6 caracteres')
        .regex(/^[0-9]+$/, 'Solo se permiten números'),
    phone: z.string()
        .min(10, 'El celular debe tener al menos 10 dígitos')
        .regex(/^[0-9]+$/, 'Solo se permiten números'),
});

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
            login(data.document, data.phone);
            toast.success('Sesión iniciada correctamente');
            navigate('/dashboard');
        } catch (error) {
            toast.error('Error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <Card className="w-full max-w-md" title="Iniciar Sesión" subtitle="Ingresa tus credenciales para acceder">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <Input
                        label="Documento de Identidad"
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
                        <Link to="/register" className="text-orange-600 font-medium hover:underline">
                            Regístrate aquí
                        </Link>
                    </div>
                </form>
            </Card>
        </div>
    );
};
