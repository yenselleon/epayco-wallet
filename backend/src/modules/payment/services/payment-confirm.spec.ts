import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { ClientDao } from '@/modules/client/dao/client.dao';
import { TransactionSessionDao } from '../dao/transaction-session.dao';
import { OtpService } from './otp.service';
import { EmailService } from './email.service';
import { DataSource } from 'typeorm';
import {
    NotFoundException,
    ConflictException,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { TransactionStatus } from '@/entities/enums/transaction-status.enum';
import { DATA_SOURCE } from '@/config/constants';

describe('PaymentService - Confirm Payment', () => {
    let service: PaymentService;
    let transactionSessionDao: Partial<Record<keyof TransactionSessionDao, jest.Mock>>;
    let otpService: Partial<Record<keyof OtpService, jest.Mock>>;
    let dataSourceMock: any;
    let queryBuilderMock: any;

    beforeEach(async () => {

        transactionSessionDao = {
            findById: jest.fn(),
            updateStatus: jest.fn(),
        };


        otpService = {
            hashToken: jest.fn(),
        };


        queryBuilderMock = {
            update: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            execute: jest.fn(),
            getOne: jest.fn(),
        };


        dataSourceMock = {
            transaction: jest.fn().mockImplementation(async (cb) => {
                const manager = {
                    createQueryBuilder: jest.fn(() => queryBuilderMock),
                };
                return await cb(manager);
            }),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentService,
                { provide: ClientDao, useValue: {} },
                { provide: TransactionSessionDao, useValue: transactionSessionDao },
                { provide: OtpService, useValue: otpService },
                { provide: EmailService, useValue: {} },
                { provide: DATA_SOURCE, useValue: dataSourceMock },
            ],
        }).compile();

        service = module.get<PaymentService>(PaymentService);
    });

    const mockSession = {
        id: 'session-123',
        clientId: 'client-123',
        token: 'hashed-token',
        amount: 5000,
        status: TransactionStatus.PENDING,
        expiresAt: new Date(Date.now() + 100000), // Futuro
    };

    const confirmDto = {
        sessionId: 'session-123',
        token: '123456',
    };

    it('should confirm payment successfully', async () => {
        transactionSessionDao.findById.mockResolvedValue(mockSession);
        otpService.hashToken.mockReturnValue('hashed-token');

        // Mock DB transaction results
        queryBuilderMock.execute.mockResolvedValueOnce({ affected: 1 }); // Update balance
        queryBuilderMock.getOne.mockResolvedValue({ balance: 95000 }); // Get client
        queryBuilderMock.execute.mockResolvedValueOnce({ affected: 1 }); // Update session status

        const result = await service.confirmPayment(confirmDto);

        expect(result).toEqual({
            message: 'Pago confirmado exitosamente',
            newBalance: 95000,
            transactionId: mockSession.id,
            amount: 5000,
        });

        // Verify transaction flow
        expect(dataSourceMock.transaction).toHaveBeenCalled();
        expect(transactionSessionDao.findById).toHaveBeenCalledWith(confirmDto.sessionId);
    });

    it('should throw NotFoundException if session not found', async () => {
        transactionSessionDao.findById.mockResolvedValue(null);
        await expect(service.confirmPayment(confirmDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if session already approved', async () => {
        transactionSessionDao.findById.mockResolvedValue({ ...mockSession, status: TransactionStatus.APPROVED });
        await expect(service.confirmPayment(confirmDto)).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if session rejected', async () => {
        transactionSessionDao.findById.mockResolvedValue({ ...mockSession, status: TransactionStatus.REJECTED });
        await expect(service.confirmPayment(confirmDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if token expired', async () => {
        transactionSessionDao.findById.mockResolvedValue({ ...mockSession, expiresAt: new Date(Date.now() - 10000) });
        await expect(service.confirmPayment(confirmDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException if token invalid', async () => {
        transactionSessionDao.findById.mockResolvedValue(mockSession);
        otpService.hashToken.mockReturnValue('wrong-hash');
        await expect(service.confirmPayment(confirmDto)).rejects.toThrow(UnauthorizedException);
    });
});
