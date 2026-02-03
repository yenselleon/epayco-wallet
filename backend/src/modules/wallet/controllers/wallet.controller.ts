import {
    Controller,
    Post,
    Get,
    Body,
    HttpCode,
    HttpStatus,
    HttpException,
    UseGuards,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { WalletService } from '../services/wallet.service';
import { RechargeWalletDto } from '../dto/recharge-wallet.dto';
import { GetBalanceDto } from '../dto/get-balance.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '@/common/decorators/current-user.decorator';


@ApiTags('Wallet')
@Controller('wallet')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
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
        status: 401,
        description: 'No autenticado',
    })
    @ApiResponse({
        status: 403,
        description: 'Los datos proporcionados no coinciden con el usuario autenticado',
    })
    async recharge(
        @CurrentUser() user: AuthenticatedUser,
        @Body() dto: RechargeWalletDto
    ): Promise<any> {
        if (dto.document !== user.document || dto.phone !== user.phone) {
            throw new HttpException(
                'Los datos proporcionados no coinciden con el usuario autenticado',
                HttpStatus.FORBIDDEN
            );
        }
        const result = await this.walletService.rechargeByUserId(user.id, dto.amount);
        return { message: 'Recarga exitosa', data: result };
    }

    @Get('balance')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Consultar saldo de billetera' })
    @ApiResponse({
        status: 200,
        description: 'Consulta exitosa',
    })
    @ApiResponse({
        status: 401,
        description: 'No autenticado',
    })
    @ApiResponse({
        status: 403,
        description: 'Los datos proporcionados no coinciden con el usuario autenticado',
    })
    async getBalance(
        @CurrentUser() user: AuthenticatedUser,
        @Query() query: GetBalanceDto
    ): Promise<any> {
        if (query.document !== user.document || query.phone !== user.phone) {
            throw new HttpException(
                'Los datos proporcionados no coinciden con el usuario autenticado',
                HttpStatus.FORBIDDEN
            );
        }
        const result = await this.walletService.getBalanceByUserId(user.id);
        return { message: 'Consulta de saldo exitosa', data: result };
    }
}
