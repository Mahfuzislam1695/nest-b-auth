import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './common/errors/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule available globally
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // Load environment-specific .env file
    }),

    // Rate limiting (optional)
    // ThrottlerModule.forRoot({
    //   ttl: 60, // Time-to-live in seconds
    //   limit: 100, // Maximum number of requests within TTL
    // }),

    // Database module (Prisma or TypeORM)
    DatabaseModule,

    // Feature modules
    UsersModule,
  ],
  providers: [
    // Global exception filter
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // Global response interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule { }