import { DataSource } from 'typeorm';
import { Client } from '@/entities/client.entity';
import { DATA_SOURCE, REPOSITORIES } from '@/config/constants';

export const ClientProvider = [
  {
    provide: REPOSITORIES.CLIENT,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Client),
    inject: [DATA_SOURCE],
  },
];
