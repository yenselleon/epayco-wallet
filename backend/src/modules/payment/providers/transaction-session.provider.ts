import { DataSource } from 'typeorm';
import { TransactionSession } from '@/entities/transaction-session.entity';
import { DATA_SOURCE, REPOSITORIES } from '@/config/constants';

export const TransactionSessionProvider = [
    {
        provide: REPOSITORIES.TRANSACTION_SESSION,
        useFactory: (dataSource: DataSource) =>
            dataSource.getRepository(TransactionSession),
        inject: [DATA_SOURCE],
    },
];
