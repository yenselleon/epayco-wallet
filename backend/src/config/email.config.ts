import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export const createEmailTransporter = (configService: ConfigService) => {
    return nodemailer.createTransport({
        host: configService.get<string>('SMTP_HOST'),
        port: configService.get<number>('SMTP_PORT'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASS'),
        },
    });
};
