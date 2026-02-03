import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
    HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from '../services/payment.service';
import { PaymentRequestDto } from '../dto/payment-request.dto';
import { ConfirmTokenDto } from '../dto/confirm-token.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '@/common/decorators/current-user.decorator';


@ApiTags('Payment')
@Controller('payment')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
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
        status: 401,
        description: 'No autenticado',
    })
    @ApiResponse({
        status: 403,
        description: 'Los datos proporcionados no coinciden con el usuario autenticado',
    })
    @ApiResponse({
        status: 400,
        description: 'Saldo insuficiente',
    })
    async requestPayment(
        @CurrentUser() user: AuthenticatedUser,
        @Body() dto: PaymentRequestDto
    ): Promise<any> {
        if (dto.document !== user.document || dto.phone !== user.phone) {
            throw new HttpException(
                'Los datos proporcionados no coinciden con el usuario autenticado',
                HttpStatus.FORBIDDEN
            );
        }
        const result = await this.paymentService.requestPaymentByUserId(user.id, dto.amount);
        return { message: 'Token de verificación enviado exitosamente', data: result };
    }

    @Post('confirm')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Confirmar pago con token OTP' })
    @ApiBody({ type: ConfirmTokenDto })
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
        description: 'Token inválido o no autenticado',
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
    async confirmPayment(
        @CurrentUser() user: AuthenticatedUser,
        @Body() dto: ConfirmTokenDto
    ): Promise<any> {
        const result = await this.paymentService.confirmPaymentByUserId(user.id, dto.sessionId, dto.token);
        return { message: 'Pago confirmado exitosamente', data: result };
    }
}
