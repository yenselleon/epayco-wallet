import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Client } from '@/entities/client.entity';
import { CreateClientDto } from '../dto/create-client.dto';
import { REPOSITORIES } from '@/config/constants';

@Injectable()
export class ClientDao {
  constructor(
    @Inject(REPOSITORIES.CLIENT)
    private readonly repository: Repository<Client>,
  ) { }

  async save(createDto: CreateClientDto): Promise<Client> {
    const client = this.repository.create(createDto);
    return await this.repository.save(client);
  }

  async findByDocument(document: string): Promise<Client | null> {
    return await this.repository.findOne({ where: { document } });
  }

  async findByEmail(email: string): Promise<Client | null> {
    return await this.repository.findOne({ where: { email } });
  }

  async findById(id: string | number): Promise<Client | null> {
    return await this.repository.findOne({ where: { id: id.toString() } });
  }

  async updateBalance(id: string, amount: number): Promise<Client | null> {
    await this.repository.increment({ id }, 'balance', amount);
    return await this.repository.findOne({ where: { id } });
  }

  /**
   * Decrementa el saldo de un cliente de forma atómica
   * @param id ID del cliente
   * @param amount Monto a decrementar
   * @returns Cliente actualizado o null si no se encontró o saldo insuficiente
   */
  async decrementBalance(id: string, amount: number): Promise<Client | null> {
    await this.repository.decrement({ id }, 'balance', amount);
    return await this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<Client[]> {
    return await this.repository.find();
  }
}
