import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmTokenDto {
    @ApiProperty({
        description: 'ID de la sesión de pago',
        example: 'f3629535-5369-4f50-ae05-6d8716c6c06a',
    })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    sessionId: string;

    @ApiProperty({
        description: 'Token de confirmación de 6 dígitos',
        example: '123456',
    })
    @IsString()
    @IsNotEmpty()
    token: string;
}
