import { transports, format, createLogger } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize, errors } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});

// Log rotation configuration
const fileTransport = new DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
});

// Create the logger
export const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }), // Log stack traces
        logFormat,
    ),
    transports: [
        new transports.Console({
            format: combine(colorize(), logFormat), // Colorize console output
        }),
        fileTransport, // Log to rotating files
    ],
    exceptionHandlers: [fileTransport], // Handle uncaught exceptions
    rejectionHandlers: [fileTransport], // Handle unhandled promise rejections
});