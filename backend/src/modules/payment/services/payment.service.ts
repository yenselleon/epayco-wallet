import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { ClientDao } from '@/modules/client/dao/client.dao';
import { TransactionSessionDao } from '../dao/transaction-session.dao';
import { OtpService } from './otp.service';
import { EmailService } from './email.service';
import { PaymentRequestDto } from '../dto/payment-request.dto';
import { HTTP_MESSAGES } from '@/config/constants';

@Injectable()
export class PaymentService {
    private readonly OTP_EXPIRATION_MINUTES = 15;

    constructor(
        private readonly clientDao: ClientDao,
        private readonly transactionSessionDao: TransactionSessionDao,
        private readonly otpService: OtpService,
        private readonly emailService: EmailService,
    ) { }

    async requestPayment(dto: PaymentRequestDto) {
        // 1. Find client by document
        const client = await this.clientDao.findByDocument(dto.document);
        if (!client) {
            throw new NotFoundException(HTTP_MESSAGES.CLIENT_NOT_FOUND);
        }

        // 2. Validate phone matches
        if (client.phone !== dto.phone) {
            throw new BadRequestException(
                'El teléfono no coincide con el documento proporcionado',
            );
        }

        // 3. Validate sufficient balance
        if (Number(client.balance) < dto.amount) {
            throw new BadRequestException(HTTP_MESSAGES.INSUFFICIENT_BALANCE);
        }

        // 4. Generate OTP token
        const { token } = this.otpService.generateOtp();

        // 5. Calculate expiration time (15 minutes from now)
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + this.OTP_EXPIRATION_MINUTES);

        // 6. Hash token for storage
        const hashedToken = this.otpService.hashToken(token);

        // 7. Create session in database
        const session = await this.transactionSessionDao.save({
            token: hashedToken,
            amount: dto.amount,
            expiresAt,
            clientId: client.id,
        });

        // 8. Send email with OTP
        await this.emailService.sendOtpEmail(client.email, client.name, token);

        // 9. Return session ID (NOT the token)
        return {
            sessionId: session.id,
            message: 'Token de verificación enviado a su correo electrónico',
            expiresAt: session.expiresAt,
        };
    }
}
