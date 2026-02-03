import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ClientDao } from '../dao/client.dao';
import { CreateClientDto } from '../dto/create-client.dto';
import { LoginDto } from '../dto/login.dto';
import { Client } from '@/entities/client.entity';
import { HTTP_MESSAGES } from '@/config/constants';

@Injectable()
export class ClientService {
    constructor(private readonly clientDao: ClientDao) { }

    async register(createClientDto: CreateClientDto): Promise<Client> {
        try {
            const existingByDocument = await this.clientDao.findByDocument(
                createClientDto.document,
            );
            if (existingByDocument) {
                throw new ConflictException(HTTP_MESSAGES.CLIENT_ALREADY_EXISTS);
            }

            const existingByEmail = await this.clientDao.findByEmail(
                createClientDto.email,
            );
            if (existingByEmail) {
                throw new ConflictException('El email ya está registrado');
            }

            const client = await this.clientDao.save(createClientDto);
            return client;
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'Error al registrar el cliente',
            );
        }
    }

    async validateClient(loginDto: LoginDto): Promise<Client> {
        const client = await this.clientDao.findByDocument(loginDto.document);

        if (!client) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        if (client.phone !== loginDto.phone) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        return client;
    }

    async findByDocument(document: string): Promise<Client> {
        const client = await this.clientDao.findByDocument(document);
        if (!client) {
            throw new ConflictException(HTTP_MESSAGES.CLIENT_NOT_FOUND);
        }
        return client;
    }

    async findAll(): Promise<Client[]> {
        return await this.clientDao.findAll();
    }
}
