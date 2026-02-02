import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalResponse } from '@/common/interfaces/global.interface';


@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, GlobalResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<GlobalResponse<T>> {
        return next.handle().pipe(
            map((data) => {
                const ctx = context.switchToHttp();
                const response = ctx.getResponse();
                const statusCode = response.statusCode;

                return {
                    status: statusCode,
                    success: true,
                    message: 'Success',
                    data: data,
                };
            }),
        );
    }
}
