import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { ClientDao } from '@/modules/client/dao/client.dao';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('WalletService', () => {
  let service: WalletService;
  let clientDao: Partial<Record<keyof ClientDao, jest.Mock>>;

  beforeEach(async () => {
    clientDao = {
      findByDocument: jest.fn(),
      updateBalance: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: ClientDao,
          useValue: clientDao,
        },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('recharge', () => {
    it('should recharge wallet successfully', async () => {
      const dto = { document: '123456', phone: '3001234567', amount: 50000 };
      const client = { id: '1', ...dto, balance: 0, email: 'test@test.com', name: 'Test' };
      const updatedClient = { ...client, balance: 50000 };

      clientDao.findByDocument.mockResolvedValue(client);
      clientDao.updateBalance.mockResolvedValue(updatedClient);

      const result = await service.recharge(dto);

      expect(clientDao.findByDocument).toHaveBeenCalledWith(dto.document);
      expect(clientDao.updateBalance).toHaveBeenCalledWith(client.id, dto.amount);
      expect(result).toEqual({
        balance: 50000,
        message: 'Recarga exitosa de 50000',
      });
    });

    it('should throw NotFoundException if client not found', async () => {
      const dto = { document: '123456', phone: '3001234567', amount: 50000 };
      clientDao.findByDocument.mockResolvedValue(null);

      await expect(service.recharge(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if phone does not match', async () => {
      const dto = { document: '123456', phone: '3001234567', amount: 50000 };
      const client = { id: '1', document: '123456', phone: '3009999999', balance: 0 };
      clientDao.findByDocument.mockResolvedValue(client);

      await expect(service.recharge(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getBalance', () => {
    it('should return balance successfully', async () => {
      const dto = { document: '123456', phone: '3001234567' };
      const client = { id: '1', ...dto, balance: 100000, name: 'Test' };

      clientDao.findByDocument.mockResolvedValue(client);

      const result = await service.getBalance(dto);

      expect(clientDao.findByDocument).toHaveBeenCalledWith(dto.document);
      expect(result).toEqual({
        balance: 100000,
        document: client.document,
        name: client.name,
      });
    });

    it('should throw NotFoundException if client not found', async () => {
      const dto = { document: '123456', phone: '3001234567' };
      clientDao.findByDocument.mockResolvedValue(null);

      await expect(service.getBalance(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if phone does not match', async () => {
      const dto = { document: '123456', phone: '3001234567' };
      const client = { id: '1', document: '123456', phone: '3009999999', balance: 0 };
      clientDao.findByDocument.mockResolvedValue(client);

      await expect(service.getBalance(dto)).rejects.toThrow(BadRequestException);
    });
  });
});
