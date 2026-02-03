import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { ClientDao } from '@/modules/client/dao/client.dao';
import { RechargeWalletDto } from '../dto/recharge-wallet.dto';
import { GetBalanceDto } from '../dto/get-balance.dto';

@Injectable()
export class WalletService {
    constructor(private readonly clientDao: ClientDao) { }

    async rechargeByUserId(userId: string, amount: number) {
        const client = await this.clientDao.findById(userId);

        if (!client) {
            throw new NotFoundException('Cliente no encontrado');
        }

        const updatedClient = await this.clientDao.updateBalance(
            client.id,
            amount,
        );

        return {
            balance: updatedClient.balance,
            message: `Recarga exitosa de ${amount}`,
        };
    }

    async getBalanceByUserId(userId: string) {
        const client = await this.clientDao.findById(userId);

        if (!client) {
            throw new NotFoundException('Cliente no encontrado');
        }

        return {
            balance: client.balance,
            document: client.document,
            name: client.name,
        };
    }


    async recharge(dto: RechargeWalletDto) {
        const client = await this.clientDao.findByDocument(dto.document);

        if (!client) {
            throw new NotFoundException('Cliente no encontrado');
        }

        if (client.phone !== dto.phone) {
            throw new BadRequestException(
                'El teléfono no coincide con el documento proporcionado',
            );
        }

        const updatedClient = await this.clientDao.updateBalance(
            client.id,
            dto.amount,
        );

        return {
            balance: updatedClient.balance,
            message: `Recarga exitosa de ${dto.amount}`,
        };
    }

    async getBalance(dto: GetBalanceDto) {
        const client = await this.clientDao.findByDocument(dto.document);

        if (!client) {
            throw new NotFoundException('Cliente no encontrado');
        }

        if (client.phone !== dto.phone) {
            throw new BadRequestException(
                'El teléfono no coincide con el documento proporcionado',
            );
        }

        return {
            balance: client.balance,
            document: client.document,
            name: client.name,
        };
    }
}
