import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../../config/logger.config';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl, ip, headers } = req;
        const userAgent = headers['user-agent'] || '';

        // Log the incoming request
        logger.info(
            `Incoming Request: ${method} ${originalUrl} - ${userAgent} ${ip}`,
            { context: 'HTTP' },
        );

        res.on('finish', () => {
            const { statusCode } = res;
            const contentLength = res.get('content-length') || 0;

            // Log the outgoing response
            logger.info(
                `Outgoing Response: ${method} ${originalUrl} ${statusCode} ${contentLength}`,
                { context: 'HTTP' },
            );
        });

        next();
    }
}