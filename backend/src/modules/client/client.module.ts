import { Module } from '@nestjs/common';
import { ClientController } from './controllers/client.controller';
import { ClientService } from './services/client.service';
import { ClientDao } from './dao/client.dao';
import { DatabaseModule } from '@/config/database/database.module';
import { ClientProvider } from './providers/client.provider';

@Module({
    imports: [DatabaseModule],
    controllers: [ClientController],
    providers: [ClientService, ClientDao, ...ClientProvider],
    exports: [ClientService, ClientDao],
})
export class ClientModule { }
