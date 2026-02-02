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
import { successResponse } from '@/utils/api-response.util';

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
        return successResponse(
            result,
            'Token de verificación enviado exitosamente',
            HttpStatus.CREATED,
        );
    }
}
