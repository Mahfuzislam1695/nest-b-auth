import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/errors/global-exception.filter'; // Updated import
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

    // Database module (Prisma or TypeORM)
    DatabaseModule,

    // Feature modules
    UsersModule,
  ],
  providers: [
    // Global exception filter (updated to use GlobalExceptionFilter)
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    // Global response interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule { }