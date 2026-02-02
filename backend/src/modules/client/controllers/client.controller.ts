import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    Get,
    Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ClientService } from '../services/client.service';
import { CreateClientDto } from '../dto/create-client.dto';
import { successResponse } from '@/utils/api-response.util';

@ApiTags('Clients')
@Controller('clients')
export class ClientController {
    constructor(private readonly clientService: ClientService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Registrar un nuevo cliente' })
    @ApiBody({ type: CreateClientDto })
    @ApiResponse({
        status: 201,
        description: 'Cliente registrado exitosamente',
    })
    @ApiResponse({
        status: 409,
        description: 'El cliente ya existe (documento o email duplicado)',
    })
    @ApiResponse({
        status: 400,
        description: 'Datos de entrada inválidos',
    })
    async register(
        @Body() createClientDto: CreateClientDto,
    ): Promise<any> {
        const client = await this.clientService.register(createClientDto);
        return successResponse(
            client,
            'Cliente registrado exitosamente',
            HttpStatus.CREATED,
        );
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Listar todos los clientes' })
    @ApiResponse({
        status: 200,
        description: 'Lista de clientes obtenida exitosamente',
    })
    async findAll(): Promise<any> {
        const clients = await this.clientService.findAll();
        return successResponse(clients, 'Clientes obtenidos exitosamente');
    }

    @Get(':document')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Buscar cliente por documento' })
    @ApiResponse({
        status: 200,
        description: 'Cliente encontrado',
    })
    @ApiResponse({
        status: 404,
        description: 'Cliente no encontrado',
    })
    async findByDocument(
        @Param('document') document: string,
    ): Promise<any> {
        const client = await this.clientService.findByDocument(document);
        return successResponse(client, 'Cliente encontrado');
    }
}
