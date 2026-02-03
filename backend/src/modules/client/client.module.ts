import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientController } from './controllers/client.controller';
import { ClientService } from './services/client.service';
import { ClientDao } from './dao/client.dao';
import { DatabaseModule } from '@/config/database/database.module';
import { ClientProvider } from './providers/client.provider';
import { JwtStrategy } from '@/common/guards/jwt.strategy';

@Module({
    imports: [
        DatabaseModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '24h' },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [ClientController],
    providers: [ClientService, ClientDao, JwtStrategy, ...ClientProvider],
    exports: [ClientService, ClientDao, JwtStrategy, PassportModule],
})
export class ClientModule { }
