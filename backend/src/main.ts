import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '@/app/app.module';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );


  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());


  const config = new DocumentBuilder()
    .setTitle('ePayco Wallet API')
    .setDescription(
      'API REST para sistema de billetera digital con funcionalidades de registro de clientes, recarga de saldo y pagos con autenticación 2FA mediante tokens OTP.',
    )
    .setVersion('1.0.0')
    .addTag('Client', 'Gestión de clientes y registro de usuarios')
    .addTag('Wallet', 'Operaciones de recarga y consulta de saldo')
    .addTag('Payment', 'Flujo de pagos con autenticación OTP (2FA)')
    .addServer('http://localhost:3000', 'Servidor de Desarrollo')
    .addServer('https://api.epayco-wallet.com', 'Servidor de Producción')
    .setContact(
      'Equipo de Desarrollo',
      'https://github.com/yenselleon/epayco-wallet',
      'yensel41@gmail.com',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'ePayco Wallet API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`📚 Swagger documentation: http://localhost:${process.env.PORT ?? 3000}/api/docs`);
}
bootstrap();

