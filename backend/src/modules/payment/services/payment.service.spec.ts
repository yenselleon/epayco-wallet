import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { ClientDao } from '@/modules/client/dao/client.dao';
import { TransactionSessionDao } from '../dao/transaction-session.dao';
import { OtpService } from './otp.service';
import { EmailService } from './email.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { HTTP_MESSAGES } from '@/config/constants';

describe('PaymentService', () => {
  let service: PaymentService;
  let clientDao: Partial<Record<keyof ClientDao, jest.Mock>>;
  let transactionSessionDao: Partial<Record<keyof TransactionSessionDao, jest.Mock>>;
  let otpService: Partial<Record<keyof OtpService, jest.Mock>>;
  let emailService: Partial<Record<keyof EmailService, jest.Mock>>;

  beforeEach(async () => {
    clientDao = {
      findByDocument: jest.fn(),
    };
    transactionSessionDao = {
      save: jest.fn(),
    };
    otpService = {
      generateOtp: jest.fn(),
      hashToken: jest.fn(),
    };
    emailService = {
      sendOtpEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: ClientDao, useValue: clientDao },
        { provide: TransactionSessionDao, useValue: transactionSessionDao },
        { provide: OtpService, useValue: otpService },
        { provide: EmailService, useValue: emailService },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('requestPayment', () => {
    const dto = { document: '123456', phone: '3001234567', amount: 50000 };
    const client = { id: 'client-uuid', ...dto, email: 'test@test.com', name: 'Test User', balance: 100000 };
    const otp = { token: '123456' };
    const hashedToken = 'hashed_token';
    const session = { id: 'session-uuid', expiresAt: new Date() };

    it('should request payment successfully', async () => {
      clientDao.findByDocument.mockResolvedValue(client);
      otpService.generateOtp.mockReturnValue(otp);
      otpService.hashToken.mockReturnValue(hashedToken);
      transactionSessionDao.save.mockResolvedValue(session);
      emailService.sendOtpEmail.mockResolvedValue(undefined);

      const result = await service.requestPayment(dto);

      expect(clientDao.findByDocument).toHaveBeenCalledWith(dto.document);
      expect(otpService.generateOtp).toHaveBeenCalled();
      expect(otpService.hashToken).toHaveBeenCalledWith(otp.token);
      expect(transactionSessionDao.save).toHaveBeenCalled();
      expect(emailService.sendOtpEmail).toHaveBeenCalledWith(client.email, client.name, otp.token);
      expect(result).toEqual({
        sessionId: session.id,
        message: 'Token de verificación enviado a su correo electrónico',
        expiresAt: session.expiresAt,
      });
    });

    it('should throw NotFoundException if client not found', async () => {
      clientDao.findByDocument.mockResolvedValue(null);
      await expect(service.requestPayment(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if phone does not match', async () => {
      clientDao.findByDocument.mockResolvedValue({ ...client, phone: '3009999999' });
      await expect(service.requestPayment(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if insufficient balance', async () => {
      clientDao.findByDocument.mockResolvedValue({ ...client, balance: 10 });
      await expect(service.requestPayment(dto)).rejects.toThrow(BadRequestException);
    });
  });
});
