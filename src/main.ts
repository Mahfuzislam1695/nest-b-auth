import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/errors/global-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ConfigService } from '@nestjs/config';
import { logger } from './config/logger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: logger,
  });

  const configService = app.get(ConfigService);

  //Enable CORS
  app.enableCors({
    origin: true, // Allow all origins
    credentials: true, // Allow credentials
  });
  // app.enableCors({
  //   origin: configService.get<string>('CORS_ORIGIN', 'http://localhost:3332'), // Use CORS_ORIGIN from .env or default to 'http://localhost:3000'
  //   credentials: configService.get<boolean>('CORS_CREDENTIALS', true), // Use CORS_CREDENTIALS from .env or default to true
  // });

  // Use cookie-parser middleware
  app.use(cookieParser());

  // Set the global prefix
  app.setGlobalPrefix('nest-b-auth/api/v1');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip out unwanted properties
      transform: true, // Automatically transform payloads to DTO instances
      forbidNonWhitelisted: true, // Throw errors for non-whitelisted properties
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('nest-b-auth')
    .setDescription('API documentation for nest-b-auth Backend')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name must match the one used in @ApiBearerAuth() in your controllers
    )
    .addCookieAuth('refreshToken')
    .addTag('Auth', 'Authentication related endpoints')
    .addTag('Users', 'User management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Root endpoint
  app.getHttpAdapter().get('/', (req, res) => {
    res.send('nest-b-auth server');
  });

  // Enable shutdown hooks
  app.enableShutdownHooks();

  // Start the application
  const port = configService.get<number>('PORT', 3332);
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger UI is running on: http://localhost:${port}/api`);
}
bootstrap();


// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import * as cookieParser from 'cookie-parser';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { GlobalExceptionFilter } from './common/errors/global-exception.filter'; // Updated import
// import { ResponseInterceptor } from './common/interceptors/response.interceptor';
// import { ConfigService } from '@nestjs/config';
// import { logger } from './config/logger.config';
// import { LoggingExceptionFilter } from './common/filters/logging-exception.filter';
// import { LoggingInterceptor } from './common/interfaces/logging.interceptor';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule, {
//     logger: logger,
//   });

//   const configService = app.get(ConfigService);

//   app.enableCors({
//     origin: configService.get<string>('CORS_ORIGIN', 'http://localhost:3000'), // Use CORS_ORIGIN from .env or default to 'http://localhost:3000'
//     credentials: configService.get<boolean>('CORS_CREDENTIALS', true), // Use CORS_CREDENTIALS from .env or default to true
//   });

//   // Use cookie-parser middleware
//   app.use(cookieParser());

//   // Set the global prefix
//   app.setGlobalPrefix('nest-b-auth/api/v1');

//   // Global validation pipe
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true, // Strip out unwanted properties
//       transform: true, // Automatically transform payloads to DTO instances
//       forbidNonWhitelisted: true, // Throw errors for non-whitelisted properties
//     }),
//   );

//   // // Global exception filter
//   // app.useGlobalFilters(new LoggingExceptionFilter()); // Use the logging exception filter

//   // // Global response interceptor
//   // app.useGlobalInterceptors(new LoggingInterceptor()); // Use the logging interceptor


//   // Global exception filter (updated to use GlobalExceptionFilter)
//   app.useGlobalFilters(new GlobalExceptionFilter());

//   // Global response interceptor
//   app.useGlobalInterceptors(new ResponseInterceptor());

//   // Swagger setup
//   const config = new DocumentBuilder()
//     .setTitle('nest-b-auth')
//     .setDescription('API documentation for nest-b-auth Backend')
//     .setVersion('1.0.0')
//     .addBearerAuth(
//       {
//         type: 'http',
//         scheme: 'bearer',
//         bearerFormat: 'JWT',
//         name: 'JWT',
//         description: 'Enter JWT token',
//         in: 'header',
//       },
//       'JWT-auth', // This name must match the one used in @ApiBearerAuth() in your controllers
//     )
//     .addCookieAuth('refreshToken')
//     .addTag('Auth', 'Authentication related endpoints')
//     .addTag('Users', 'User management endpoints')
//     .build();

//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api', app, document);

//   // Root endpoint
//   app.getHttpAdapter().get('/', (req, res) => {
//     res.send('nest-b-auth server');
//   });

//   // Enable shutdown hooks
//   app.enableShutdownHooks();

//   // Start the application
//   const port = configService.get<number>('PORT', 3332);
//   await app.listen(port);

//   // Use cookie-parser middleware
//   app.use(cookieParser());

//   console.log(`Application is running on: http://localhost:${port}`);
//   console.log(`Swagger UI is running on: http://localhost:${port}/api`);
// }
// bootstrap();
