import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { logger } from '../../config/logger.config';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, originalUrl, ip, headers } = request;
        const userAgent = headers['user-agent'] || '';

        // Log the incoming request
        logger.info(
            `Incoming Request: ${method} ${originalUrl} - ${userAgent} ${ip}`,
            { context: 'HTTP' },
        );

        return next.handle().pipe(
            tap(() => {
                const response = context.switchToHttp().getResponse();
                const { statusCode } = response;

                // Log the outgoing response
                logger.info(
                    `Outgoing Response: ${method} ${originalUrl} ${statusCode}`,
                    { context: 'HTTP' },
                );
            }),
        );
    }
}