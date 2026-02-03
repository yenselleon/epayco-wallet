import { IsString, IsNotEmpty, Matches, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        description: 'Documento de identidad del cliente',
        example: '1234567890',
        minLength: 6,
        maxLength: 20,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    @Matches(/^[0-9]+$/, { message: 'El documento solo puede contener números' })
    document: string;

    @ApiProperty({
        description: 'Número de teléfono del cliente',
        example: '3001234567',
        minLength: 10,
        maxLength: 15,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(15)
    @Matches(/^[0-9]+$/, { message: 'El teléfono solo puede contener números' })
    phone: string;
}
