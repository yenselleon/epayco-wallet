import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@/config/database/database.module';
import { ClientModule } from '@/modules/client/client.module';
import { WalletModule } from '@/modules/wallet/wallet.module';
import { PaymentModule } from '@/modules/payment/payment.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    DatabaseModule,
    ClientModule,
    WalletModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
