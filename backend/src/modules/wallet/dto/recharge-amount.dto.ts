import { IsNumber, IsPositive, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RechargeAmountDto {
    @ApiProperty({
        description: 'Monto a recargar',
        example: 50000,
        minimum: 1,
        maximum: 10000000,
    })
    @IsNumber()
    @IsPositive({ message: 'El monto debe ser mayor a 0' })
    @Max(10000000, { message: 'El monto máximo es 10,000,000' })
    amount: number;
}
