import {
    IsString,
    IsNotEmpty,
    Length,
    Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetBalanceDto {
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
}
