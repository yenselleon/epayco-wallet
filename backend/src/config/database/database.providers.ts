import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { databaseConfig } from './database.config';
import { entities } from './database.import';

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
                database: configService.get<string>('DB_NAME'),
                entities: entities,
                synchronize: true,
                logging: configService.get<string>('NODE_ENV') === 'development',
                poolSize: 5,
                connectTimeout: 60000,
            });

            return dataSource.initialize();
        },
    },
];
