import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthLayout } from '../layouts/AuthLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { registerClient } from '../services/client.service';

const registerSchema = z.object({
    document: z.string()
        .min(6, 'El ID User debe tener al menos 6 caracteres')
        .max(20, 'El ID User no puede exceder 20 caracteres')
        .regex(/^[0-9]+$/, 'Solo se permiten números'),
    name: z.string()
        .min(3, 'El nombre debe tener al menos 3 caracteres'),
    email: z.string()
        .email('Ingresa un correo válido'),
    phone: z.string()
        .min(10, 'El celular debe tener al menos 10 dígitos')
        .max(15, 'El celular no puede exceder 15 dígitos')
        .regex(/^[0-9]+$/, 'Solo se permiten números'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        try {
            await registerClient(data);
            toast.success('¡Registro exitoso! Bienvenido a ePayco Wallet.');
            navigate('/');
        } catch (error: any) {
            // El interceptor devuelve un objeto con { message, status, originalError }
            if (error.status === 409) {
                toast.error('Este usuario ya se encuentra registrado.');
            } else if (error.status !== 500) {
                // Errores 400 y otros no manejados globalmente por el interceptor con toast
                toast.error(error.message || 'Error al procesar el registro');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <Card title="Crear Cuenta" subtitle="Regístrate para empezar a usar tu billetera">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <Input
                        label="ID User"
                        placeholder="Ej: 1234567890"
                        error={errors.document?.message}
                        {...register('document')}
                    />

                    <Input
                        label="Nombre Completo"
                        placeholder="Ej: Juan Pérez"
                        error={errors.name?.message}
                        {...register('name')}
                    />

                    <Input
                        label="Correo Electrónico"
                        type="email"
                        placeholder="juan@example.com"
                        error={errors.email?.message}
                        {...register('email')}
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
                        Registrarse
                    </Button>

                    <div className="text-center text-sm text-gray-500 mt-4">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/" className="text-orange-600 font-medium hover:underline">
                            Inicia Sesión
                        </Link>
                    </div>
                </form>
            </Card>
        </AuthLayout>
    );
};
