import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/errors/global-exception.filter';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { AttachUserMiddleware } from './middleware/attach-user.middleware'; // Import the middleware
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './modules/users/users.service';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule available globally
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),

    // Database module (Prisma or TypeORM)
    DatabaseModule,

    // Feature modules
    UsersModule,
    AuthModule,
  ],
  providers: [
    // Global exception filter
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    // Apply RolesGuard globally
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // Services required by the middleware
    JwtService,
    ConfigService,
    UsersService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the AttachUserMiddleware to all routes
    consumer
      .apply(AttachUserMiddleware)
      .forRoutes('*');
  }
}
// import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
// import { GlobalExceptionFilter } from './common/errors/global-exception.filter'; // Updated import
// import { ResponseInterceptor } from './common/interceptors/response.interceptor';
// import { UsersModule } from './modules/users/users.module';
// import { DatabaseModule } from './modules/database/database.module';
// import { AuthModule } from './modules/auth/auth.module';
// import { RolesGuard } from './modules/auth/guards/roles.guard';
// import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

// @Module({
//   imports: [
//     // Load environment variables
//     ConfigModule.forRoot({
//       isGlobal: true, // Make ConfigModule available globally
//       envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
//     }),

//     // Database module (Prisma or TypeORM)
//     DatabaseModule,

//     // Feature modules
//     UsersModule,

//     AuthModule,
//   ],
//   providers: [
//     // Global exception filter (updated to use GlobalExceptionFilter)
//     {
//       provide: APP_FILTER,
//       useClass: GlobalExceptionFilter,
//     },
//     // Apply JwtAuthGuard globally
//     // {
//     //   provide: APP_GUARD,
//     //   useClass: JwtAuthGuard,
//     // },
//     // Apply RolesGuard globally
//     {
//       provide: APP_GUARD,
//       useClass: RolesGuard,
//     },
//   ],
// })
// export class AppModule { }