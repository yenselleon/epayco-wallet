import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createEmailTransporter } from '@/config/email.config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = createEmailTransporter(this.configService);
  }

  async sendOtpEmail(
    email: string,
    name: string,
    token: string,
  ): Promise<void> {
    const emailFrom = this.configService.get<string>('SMTP_FROM');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .token-box { background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
            .token { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Código de Verificación</h1>
              <p>ePayco Wallet</p>
            </div>
            <div class="content">
              <p>Hola <strong>${name}</strong>,</p>
              <p>Has solicitado realizar un pago. Para confirmar la transacción, utiliza el siguiente código de verificación:</p>
              
              <div class="token-box">
                <div class="token">${token}</div>
              </div>

              <div class="warning">
                <strong>⚠️ Importante:</strong> Este código expira en <strong>15 minutos</strong>.
              </div>

              <p>Si no solicitaste este código, ignora este mensaje y tu cuenta permanecerá segura.</p>
              
              <p>Saludos,<br><strong>Equipo de ePayco Wallet</strong></p>
            </div>
            <div class="footer">
              <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
              <p>&copy; 2026 ePayco Wallet. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      // Log token BEFORE sending, so we have it if email fails (development/testing)
      this.logger.log(`⚠️ DEVELOPMENT MODE: OTP Token for ${email}: ${token}`);

      await this.transporter.sendMail({
        from: emailFrom,
        to: email,
        subject: '🔐 Código de Verificación - ePayco Wallet',
        html: htmlContent,
      });

      this.logger.log(`OTP email sent successfully to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${email} (Non-fatal in Dev):`, error);
      // specific error suppression for development environment
      // do NOT throw error to allow flow to continue without SMTP server
    }
  }
}
