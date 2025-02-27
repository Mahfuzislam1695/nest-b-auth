// import {
//     ExceptionFilter,
//     Catch,
//     ArgumentsHost,
//     HttpStatus,
//     BadRequestException,
//     UnauthorizedException,
//     ForbiddenException,
// } from '@nestjs/common';
// import { Response } from 'express';
// import { ApiError } from './api-error';
// import { ValidationError } from 'class-validator';

// @Catch()
// export class GlobalExceptionFilter implements ExceptionFilter {
//     catch(exception: unknown, host: ArgumentsHost) {
//         const ctx = host.switchToHttp();
//         const response = ctx.getResponse<Response>();

//         let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
//         let message = 'Internal server error';

//         if (exception instanceof ApiError) {
//             // Handle custom API errors
//             statusCode = exception.statusCode;
//             message = exception.message;
//         } else if (exception instanceof BadRequestException) {
//             // Handle validation errors
//             const validationErrors = exception.getResponse();
//             if (
//                 Array.isArray(validationErrors['message']) &&
//                 validationErrors['message'][0] instanceof ValidationError
//             ) {
//                 statusCode = HttpStatus.BAD_REQUEST;
//                 message = validationErrors['message']
//                     .map((err: ValidationError) => Object.values(err.constraints).join(', '))
//                     .join(', ');
//             } else {
//                 statusCode = HttpStatus.BAD_REQUEST;
//                 message = validationErrors['message'] || 'Validation failed';
//             }
//         }
//         else if (exception instanceof UnauthorizedException) {
//             // Handle unauthorized errors (e.g., invalid credentials or missing token)
//             statusCode = HttpStatus.UNAUTHORIZED;
//             message = 'Unauthorized: Invalid credentials or missing token';
//         }
//         else if (exception instanceof ForbiddenException) {
//             // Handle forbidden errors (e.g., insufficient permissions)
//             statusCode = HttpStatus.FORBIDDEN;
//             message = 'Forbidden: You do not have permission to access this resource';
//         } else if (exception instanceof Error) {
//             // Handle generic errors
//             message = exception.message;
//         }

//         // Send the response
//         response.status(statusCode).json({
//             statusCode,
//             success: false,
//             message,
//         });
//     }
// }
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
    BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiError } from './api-error';
import { ValidationError } from 'class-validator';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        if (exception instanceof ApiError) {
            // Handle custom API errors
            statusCode = exception.statusCode;
            message = exception.message;
        } else if (exception instanceof BadRequestException) {
            // Handle validation errors
            const validationErrors = exception.getResponse();
            if (
                Array.isArray(validationErrors['message']) &&
                validationErrors['message'][0] instanceof ValidationError
            ) {
                statusCode = HttpStatus.BAD_REQUEST;
                message = validationErrors['message']
                    .map((err: ValidationError) => Object.values(err.constraints).join(', '))
                    .join(', ');
            } else {
                statusCode = HttpStatus.BAD_REQUEST;
                message = validationErrors['message'] || 'Validation failed';
            }
        }

        // Send the response
        response.status(statusCode).json({
            statusCode,
            success: false,
            message,
        });
    }
}