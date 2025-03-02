import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { logger } from '../../config/logger.config';

@Module({
    imports: [
        WinstonModule.forRoot({
            instance: logger,
        }),
    ],
    exports: [WinstonModule],
})
export class LoggerModule { }