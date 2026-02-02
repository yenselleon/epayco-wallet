import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { FaMoneyBillWave } from 'react-icons/fa';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { rechargeWallet } from '../../services/wallet.service';
import { useAuth } from '../../context/AuthContext';
import { rechargeSchema } from '../../utils/validations';
import { formatCurrency } from '../../utils/formatters';
import { SUCCESS_MESSAGES } from '../../utils/constants';
import type { z } from 'zod';

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
        defaultValues: {
            document: user?.document || '',
            phone: user?.phone || '',
        },
    });

    const onSubmit = async (data: RechargeFormValues) => {
        if (!user) return;

        setIsLoading(true);
        try {
            const result = await rechargeWallet({
                document: data.document,
                phone: data.phone,
                amount: data.amount,
            });

            toast.success(SUCCESS_MESSAGES.RECHARGE(formatCurrency(result.balance)));

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
                    label="ID User"
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
