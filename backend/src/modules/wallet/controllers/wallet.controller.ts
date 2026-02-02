import {
    Controller,
    Post,
    Get,
    Body,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { WalletService } from '../services/wallet.service';
import { RechargeWalletDto } from '../dto/recharge-wallet.dto';
import { GetBalanceDto } from '../dto/get-balance.dto';
import { successResponse } from '@/utils/api-response.util';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletService) { }

    @Post('recharge')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Recargar saldo de billetera' })
    @ApiBody({ type: RechargeWalletDto })
    @ApiResponse({
        status: 200,
        description: 'Recarga exitosa',
    })
    @ApiResponse({
        status: 404,
        description: 'Cliente no encontrado',
    })
    @ApiResponse({
        status: 400,
        description: 'Teléfono no coincide con el documento',
    })
    async recharge(@Body() dto: RechargeWalletDto): Promise<any> {
        const result = await this.walletService.recharge(dto);
        return successResponse(result, 'Recarga exitosa');
    }

    @Get('balance')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Consultar saldo de billetera' })
    @ApiResponse({
        status: 200,
        description: 'Consulta exitosa',
    })
    @ApiResponse({
        status: 404,
        description: 'Cliente no encontrado',
    })
    @ApiResponse({
        status: 400,
        description: 'Teléfono no coincide con el documento o parámetros inválidos',
    })
    async getBalance(@Query() dto: GetBalanceDto): Promise<any> {
        const result = await this.walletService.getBalance(dto);
        return successResponse(result, 'Consulta de saldo exitosa');
    }
}
