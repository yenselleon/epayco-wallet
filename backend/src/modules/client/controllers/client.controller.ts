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
import { JwtService } from '@nestjs/jwt';
import { ClientService } from '../services/client.service';
import { CreateClientDto } from '../dto/create-client.dto';
import { LoginDto } from '../dto/login.dto';


@ApiTags('Clients')
@Controller('clients')
export class ClientController {
    constructor(
        private readonly clientService: ClientService,
        private readonly jwtService: JwtService,
    ) { }

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
        return { message: 'Cliente registrado exitosamente', data: client };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Iniciar sesión' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: 200,
        description: 'Login exitoso',
    })
    @ApiResponse({
        status: 401,
        description: 'Credenciales inválidas',
    })
    async login(@Body() loginDto: LoginDto): Promise<any> {
        const client = await this.clientService.validateClient(loginDto);


        const payload = {
            sub: client.id,
            document: client.document,
            phone: client.phone,
        };

        const access_token = await this.jwtService.signAsync(payload);

        return {
            message: 'Login exitoso',
            data: {
                access_token,
                user: {
                    document: client.document,
                    phone: client.phone,
                    name: client.name,
                },
            },
        };
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
        return { message: 'Clientes obtenidos exitosamente', data: clients };
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
        return { message: 'Cliente encontrado', data: client };
    }
}
