import {
    IsString,
    IsNotEmpty,
    IsNumber,
    Min,
    Max,
    Length,
    Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class RechargeWalletDto {
    @ApiProperty({
        description: 'Documento de identidad del cliente',
        example: '1234567890',
        minLength: 6,
        maxLength: 20,
    })
    @IsString()
    @IsNotEmpty({ message: 'El documento es requerido' })
    @Length(6, 20, {
        message: 'El documento debe tener entre 6 y 20 caracteres',
    })
    @Matches(/^[0-9]+$/, { message: 'El documento debe contener solo números' })
    document: string;

    @ApiProperty({
        description: 'Número de teléfono del cliente',
        example: '3001234567',
        minLength: 10,
        maxLength: 15,
    })
    @IsString()
    @IsNotEmpty({ message: 'El teléfono es requerido' })
    @Length(10, 15, {
        message: 'El teléfono debe tener entre 10 y 15 caracteres',
    })
    @Matches(/^[0-9]+$/, {
        message: 'El teléfono debe contener solo números',
    })
    phone: string;

    @ApiProperty({
        description: 'Monto a recargar',
        example: 50000,
        minimum: 1,
        maximum: 10000000,
    })
    @IsNumber({}, { message: 'El monto debe ser un número' })
    @Type(() => Number)
    @Min(1, { message: 'El monto mínimo es 1' })
    @Max(10000000, { message: 'El monto máximo es 10000000' })
    amount: number;
}
