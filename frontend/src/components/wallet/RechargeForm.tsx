import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { FaMoneyBillWave } from 'react-icons/fa';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { rechargeWallet } from '../../services/wallet.service';
import { useAuth } from '../../context/AuthContext';

const rechargeSchema = z.object({
    amount: z.number()
        .min(1, 'El monto mínimo es $1')
        .max(10000000, 'El monto máximo es $10,000,000'),
});

type RechargeFormValues = z.infer<typeof rechargeSchema>;

interface RechargeFormProps {
    onSuccess?: () => void;
}

export const RechargeForm = ({ onSuccess }: RechargeFormProps) => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<RechargeFormValues>({
        resolver: zodResolver(rechargeSchema),
    });

    const onSubmit = async (data: RechargeFormValues) => {
        if (!user) return;

        setIsLoading(true);
        try {
            const result = await rechargeWallet({
                document: user.document,
                phone: user.phone,
                amount: data.amount,
            });

            toast.success(`Recarga exitosa. Nuevo saldo: ${new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
            }).format(Number(result.balance))}`);

            reset();
            onSuccess?.();
        } catch (error: any) {
            if (error.status !== 500) {
                toast.error(error.message || 'Error al procesar la recarga');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card
            title="Recargar Saldo"
            subtitle="Incrementa el saldo de tu billetera"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                <Input
                    label="Documento"
                    value={user?.document || ''}
                    disabled
                />

                <Input
                    label="Celular"
                    value={user?.phone || ''}
                    disabled
                />

                <Input
                    label="Monto a Recargar"
                    type="number"
                    placeholder="Ej: 50000"
                    error={errors.amount?.message}
                    {...register('amount', { valueAsNumber: true })}
                />

                <Button
                    type="submit"
                    fullWidth
                    isLoading={isLoading}
                    variant="primary"
                >
                    <FaMoneyBillWave /> Recargar
                </Button>
            </form>
        </Card>
    );
};
