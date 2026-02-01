import { Injectable, Inject } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Client } from '@/entities/client.entity';
import { CreateClientDto } from '../dto/create-client.dto';
import { DATA_SOURCE } from '@/config/constants';

@Injectable()
export class ClientDao {
  private repository: Repository<Client>;

  constructor(@Inject(DATA_SOURCE) private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Client);
  }

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

  async findById(id: string): Promise<Client | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async updateBalance(id: string, amount: number): Promise<Client | null> {
    const client = await this.findById(id);
    if (!client) return null;

    client.balance = Number(client.balance) + amount;
    return await this.repository.save(client);
  }

  async findAll(): Promise<Client[]> {
    return await this.repository.find();
  }
}
