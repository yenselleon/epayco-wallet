import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Length, Matches } from 'class-validator';

/**
 * DTO para confirmar un pago con token OTP
 */
export class PaymentConfirmDto {
    @ApiProperty({
        description: 'ID de la sesión de transacción generada en /payment/request',
        example: 'f3629535-5369-4f50-ae05-6d8716c6c06a',
        format: 'uuid',
    })
    @IsUUID('4', { message: 'El sessionId debe ser un UUID válido' })
    sessionId: string;

    @ApiProperty({
        description: 'Token OTP de 6 dígitos enviado por email',
        example: '826375',
        minLength: 6,
        maxLength: 6,
        pattern: '^\\d{6}$',
    })
    @IsString({ message: 'El token debe ser una cadena de texto' })
    @Length(6, 6, { message: 'El token debe tener exactamente 6 dígitos' })
    @Matches(/^\d{6}$/, {
        message: 'El token debe contener solo números (6 dígitos)',
    })
    token: string;
}
