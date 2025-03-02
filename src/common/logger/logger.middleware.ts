import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../../config/logger.config';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl, ip } = req;
        const userAgent = req.get('user-agent') || '';

        res.on('finish', () => {
            const { statusCode } = res;
            const contentLength = res.get('content-length') || 0;

            logger.info(
                `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
                { context: 'HTTP' },
            );
        });

        next();
    }
}