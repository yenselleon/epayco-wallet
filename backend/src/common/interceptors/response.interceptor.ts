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


                let message = 'Success';
                let actualData = data;


                if (data && typeof data === 'object' && 'message' in data) {
                    message = (data as any).message;

                    if ('data' in data) {
                        actualData = (data as any).data;
                    } else {

                        const { message: _, ...rest } = data as any;
                        actualData = Object.keys(rest).length > 0 ? rest as T : data;
                    }
                }

                return {
                    status: statusCode,
                    success: true,
                    message,
                    data: actualData,
                };
            }),
        );
    }
}
