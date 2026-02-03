import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ConflictException,
    UnauthorizedException,
    Inject,
} from '@nestjs/common';
import { ClientDao } from '@/modules/client/dao/client.dao';
import { TransactionSessionDao } from '../dao/transaction-session.dao';
import { OtpService } from './otp.service';
import { EmailService } from './email.service';
import { PaymentRequestDto } from '../dto/payment-request.dto';
import { PaymentConfirmDto } from '../dto/payment-confirm.dto';
import { HTTP_MESSAGES, DATA_SOURCE } from '@/config/constants';
import { DataSource } from 'typeorm';
import { Client } from '@/entities/client.entity';
import { TransactionSession } from '@/entities/transaction-session.entity';
import { TransactionStatus } from '@/entities/enums/transaction-status.enum';

@Injectable()
export class PaymentService {
    private readonly OTP_EXPIRATION_MINUTES = 15;

    constructor(
        private readonly clientDao: ClientDao,
        private readonly transactionSessionDao: TransactionSessionDao,
        private readonly otpService: OtpService,
        private readonly emailService: EmailService,
        @Inject(DATA_SOURCE)
        private readonly dataSource: DataSource,
    ) { }

    async requestPaymentByUserId(userId: string, amount: number) {
        const client = await this.clientDao.findById(userId);
        if (!client) {
            throw new NotFoundException(HTTP_MESSAGES.CLIENT_NOT_FOUND);
        }

        if (Number(client.balance) < amount) {
            throw new BadRequestException(HTTP_MESSAGES.INSUFFICIENT_BALANCE);
        }

        const { token } = this.otpService.generateOtp();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + this.OTP_EXPIRATION_MINUTES);
        const hashedToken = this.otpService.hashToken(token);

        const session = await this.transactionSessionDao.save({
            token: hashedToken,
            amount: amount,
            expiresAt,
            clientId: client.id,
        });

        await this.emailService.sendOtpEmail(client.email, client.name, token);

        return {
            sessionId: session.id,
            message: 'Token de verificación enviado a su correo electrónico',
            expiresAt: session.expiresAt,
        };
    }

    async confirmPaymentByUserId(userId: string, sessionId: string, token: string) {
        const session = await this.transactionSessionDao.findById(sessionId);
        if (!session) {
            throw new NotFoundException('Sesión de pago no encontrada');
        }

        if (session.clientId !== userId) {
            throw new UnauthorizedException('Esta sesión no pertenece al usuario autenticado');
        }

        if (session.status === TransactionStatus.APPROVED) {
            throw new ConflictException('Esta transacción ya fue procesada exitosamente');
        }
        if (session.status === TransactionStatus.REJECTED) {
            throw new BadRequestException('Esta transacción fue rechazada previamente');
        }

        const now = new Date();
        if (session.expiresAt < now) {
            await this.transactionSessionDao.updateStatus(session.id, TransactionStatus.REJECTED);
            throw new BadRequestException('El token ha expirado. Por favor, solicite un nuevo pago.');
        }

        const hashedInputToken = this.otpService.hashToken(token);
        if (hashedInputToken !== session.token) {
            throw new UnauthorizedException('Token de verificación inválido');
        }

        const result = await this.dataSource.transaction(async (manager) => {
            const updateResult = await manager
                .createQueryBuilder()
                .update(Client)
                .set({ balance: () => `balance - ${session.amount}` })
                .where('id = :id', { id: session.clientId })
                .andWhere('balance >= :amount', { amount: session.amount })
                .execute();

            if (updateResult.affected === 0) {
                throw new BadRequestException('Saldo insuficiente para completar la transacción');
            }

            const updatedClient = await manager
                .createQueryBuilder(Client, 'client')
                .where('id = :id', { id: session.clientId })
                .getOne();

            await manager
                .createQueryBuilder()
                .update(TransactionSession)
                .set({ status: TransactionStatus.APPROVED })
                .where('id = :id', { id: session.id })
                .execute();

            return {
                newBalance: Number(updatedClient.balance),
                transactionId: session.id,
                amount: Number(session.amount),
            };
        });

        return {
            message: 'Pago confirmado exitosamente',
            newBalance: result.newBalance,
            transactionId: result.transactionId,
            amount: result.amount,
        };
    }

    async requestPayment(dto: PaymentRequestDto) {
        const client = await this.clientDao.findByDocument(dto.document);
        if (!client) {
            throw new NotFoundException(HTTP_MESSAGES.CLIENT_NOT_FOUND);
        }

        if (client.phone !== dto.phone) {
            throw new BadRequestException('El teléfono no coincide con el documento proporcionado');
        }

        if (Number(client.balance) < dto.amount) {
            throw new BadRequestException(HTTP_MESSAGES.INSUFFICIENT_BALANCE);
        }

        const { token } = this.otpService.generateOtp();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + this.OTP_EXPIRATION_MINUTES);
        const hashedToken = this.otpService.hashToken(token);

        const session = await this.transactionSessionDao.save({
            token: hashedToken,
            amount: dto.amount,
            expiresAt,
            clientId: client.id,
        });

        await this.emailService.sendOtpEmail(client.email, client.name, token);

        return {
            sessionId: session.id,
            message: 'Token de verificación enviado a su correo electrónico',
            expiresAt: session.expiresAt,
        };
    }

    async confirmPayment(dto: PaymentConfirmDto) {
        const session = await this.transactionSessionDao.findById(dto.sessionId);
        if (!session) {
            throw new NotFoundException('Sesión de pago no encontrada');
        }

        if (session.status === TransactionStatus.APPROVED) {
            throw new ConflictException('Esta transacción ya fue procesada exitosamente');
        }
        if (session.status === TransactionStatus.REJECTED) {
            throw new BadRequestException('Esta transacción fue rechazada previamente');
        }

        const now = new Date();
        if (session.expiresAt < now) {
            await this.transactionSessionDao.updateStatus(session.id, TransactionStatus.REJECTED);
            throw new BadRequestException('El token ha expirado. Por favor, solicite un nuevo pago.');
        }

        const hashedInputToken = this.otpService.hashToken(dto.token);
        if (hashedInputToken !== session.token) {
            throw new UnauthorizedException('Token de verificación inválido');
        }

        const result = await this.dataSource.transaction(async (manager) => {
            const updateResult = await manager
                .createQueryBuilder()
                .update(Client)
                .set({ balance: () => `balance - ${session.amount}` })
                .where('id = :id', { id: session.clientId })
                .andWhere('balance >= :amount', { amount: session.amount })
                .execute();

            if (updateResult.affected === 0) {
                throw new BadRequestException('Saldo insuficiente para completar la transacción');
            }

            const updatedClient = await manager
                .createQueryBuilder(Client, 'client')
                .where('id = :id', { id: session.clientId })
                .getOne();

            await manager
                .createQueryBuilder()
                .update(TransactionSession)
                .set({ status: TransactionStatus.APPROVED })
                .where('id = :id', { id: session.id })
                .execute();

            return {
                newBalance: Number(updatedClient.balance),
                transactionId: session.id,
                amount: Number(session.amount),
            };
        });

        return {
            message: 'Pago confirmado exitosamente',
            newBalance: result.newBalance,
            transactionId: result.transactionId,
            amount: result.amount,
        };
    }
}
