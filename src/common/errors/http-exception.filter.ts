import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiError } from './api-error';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal Server Error';

        if (exception instanceof ApiError) {
            statusCode = exception.statusCode;
            message = exception.message;
        } else if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            message = exception.message;
        }

        response.status(statusCode).json({
            statusCode,
            success: false,
            message,
        });
    }
}