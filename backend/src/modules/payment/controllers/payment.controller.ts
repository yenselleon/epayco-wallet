import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PaymentService } from '../services/payment.service';
import { PaymentRequestDto } from '../dto/payment-request.dto';
import { PaymentConfirmDto } from '../dto/payment-confirm.dto';


@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post('request')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Solicitar pago y generar token OTP' })
    @ApiBody({ type: PaymentRequestDto })
    @ApiResponse({
        status: 201,
        description: 'Token enviado exitosamente al correo del cliente',
    })
    @ApiResponse({
        status: 404,
        description: 'Cliente no encontrado',
    })
    @ApiResponse({
        status: 400,
        description: 'Teléfono no coincide o saldo insuficiente',
    })
    @ApiResponse({
        status: 500,
        description: 'Error al enviar el correo electrónico',
    })
    async requestPayment(@Body() dto: PaymentRequestDto): Promise<any> {
        const result = await this.paymentService.requestPayment(dto);
        return { message: 'Token de verificación enviado exitosamente', data: result };
    }

    @Post('confirm')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Confirmar pago con token OTP' })
    @ApiBody({ type: PaymentConfirmDto })
    @ApiResponse({
        status: 200,
        description: 'Pago confirmado exitosamente',
        schema: {
            example: {
                status: 200,
                success: true,
                message: 'Pago confirmado exitosamente',
                data: {
                    message: 'Pago confirmado exitosamente',
                    newBalance: 90000,
                    transactionId: 'f3629535-5369-4f50-ae05-6d8716c6c06a',
                    amount: 10000,
                },
            },
        },
    })
    @ApiResponse({
        status: 401,
        description: 'Token inválido',
    })
    @ApiResponse({
        status: 404,
        description: 'Sesión no encontrada',
    })
    @ApiResponse({
        status: 409,
        description: 'Transacción ya procesada',
    })
    @ApiResponse({
        status: 400,
        description: 'Token expirado o saldo insuficiente',
    })
    async confirmPayment(@Body() dto: PaymentConfirmDto): Promise<any> {
        const result = await this.paymentService.confirmPayment(dto);
        return { message: 'Pago confirmado exitosamente', data: result };
    }
}
