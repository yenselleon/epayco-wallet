import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { GlobalResponse } from '@/common/interfaces/global.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message || 'Unexpected error';

    this.logger.error(
      `Http Status: ${status} Error Message: ${JSON.stringify(message)}`,
    );

    const errorResponse: GlobalResponse<null> = {
      status,
      success: false,
      message: Array.isArray(message) ? message.join(', ') : message,
      data: null,
    };

    response.status(status).json(errorResponse);
  }
}
