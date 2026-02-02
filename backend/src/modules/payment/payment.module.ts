import { Module } from '@nestjs/common';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { OtpService } from './services/otp.service';
import { EmailService } from './services/email.service';
import { TransactionSessionDao } from './dao/transaction-session.dao';
import { TransactionSessionProvider } from './providers/transaction-session.provider';
import { ClientModule } from '@/modules/client/client.module';
import { DatabaseModule } from '@/config/database/database.module';

@Module({
    imports: [ClientModule, DatabaseModule],
    controllers: [PaymentController],
    providers: [
        PaymentService,
        OtpService,
        EmailService,
        TransactionSessionDao,
        ...TransactionSessionProvider,
    ],
    exports: [PaymentService, TransactionSessionDao, OtpService],
})
export class PaymentModule { }
