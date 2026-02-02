import { Injectable, Inject } from '@nestjs/common';
import { Repository, MoreThan } from 'typeorm';
import { TransactionSession } from '@/entities/transaction-session.entity';
import { REPOSITORIES } from '@/config/constants';
import { TransactionStatus } from '@/entities/enums/transaction-status.enum';

@Injectable()
export class TransactionSessionDao {
    constructor(
        @Inject(REPOSITORIES.TRANSACTION_SESSION)
        private readonly repository: Repository<TransactionSession>,
    ) { }

    async save(session: Partial<TransactionSession>): Promise<TransactionSession> {
        const newSession = this.repository.create(session);
        return await this.repository.save(newSession);
    }

    async findByToken(token: string): Promise<TransactionSession | null> {
        return await this.repository.findOne({
            where: { token },
            relations: ['client'],
        });
    }

    async findById(id: string): Promise<TransactionSession | null> {
        return await this.repository.findOne({
            where: { id },
            relations: ['client'],
        });
    }

    async findValidSession(id: string): Promise<TransactionSession | null> {
        return await this.repository.findOne({
            where: {
                id,
                status: TransactionStatus.PENDING,
                expiresAt: MoreThan(new Date()),
            },
            relations: ['client'],
        });
    }

    async updateStatus(
        id: string,
        status: TransactionStatus,
    ): Promise<TransactionSession | null> {
        const session = await this.findById(id);
        if (!session) return null;

        session.status = status;
        return await this.repository.save(session);
    }
}
