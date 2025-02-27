import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const statusCode = exception.getStatus();
        const message = exception.getResponse();

        response.status(statusCode).json({
            statusCode,
            success: false,
            message: typeof message === 'string' ? message : (message as any).message,
        });
    }
}