import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { databaseConfig } from './database.config';
import { ArrayEntities } from './database.import';

export const DATA_SOURCE = 'DATA_SOURCE';

export const databaseProviders = [
    {
        provide: DATA_SOURCE,
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
            const dataSource = new DataSource({
                type: 'mysql',
                host: databaseConfig.host,
                port: databaseConfig.port,
                username: databaseConfig.username,
                password: databaseConfig.password,
                database: databaseConfig.database,
                entities: ArrayEntities,
                synchronize: configService.get<string>('NODE_ENV') === 'development',
                logging: configService.get<string>('NODE_ENV') === 'development',
                poolSize: 5,
                connectTimeout: 60000,
            });

            return dataSource.initialize();
        },
    },
];
