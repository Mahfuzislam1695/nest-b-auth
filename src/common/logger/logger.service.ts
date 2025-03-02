import { Injectable, LoggerService } from '@nestjs/common';
import { logger } from '../../config/logger.config';

@Injectable()
export class CustomLogger implements LoggerService {
    log(message: string, context?: string) {
        logger.info(message, { context });
    }

    error(message: string, trace: string, context?: string) {
        logger.error(message, { trace, context });
    }

    warn(message: string, context?: string) {
        logger.warn(message, { context });
    }

    debug(message: string, context?: string) {
        logger.debug(message, { context });
    }

    verbose(message: string, context?: string) {
        logger.verbose(message, { context });
    }
}