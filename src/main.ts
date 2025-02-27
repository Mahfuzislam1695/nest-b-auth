import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/errors/global-exception.filter'; // Updated import
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  // app.enableCors();
  app.enableCors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true, // Allow cookies to be sent
  });

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

  // Global exception filter (updated to use GlobalExceptionFilter)
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
  const port = process.env.PORT || 3332;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger UI is running on: http://localhost:${port}/api`);
}
bootstrap();
