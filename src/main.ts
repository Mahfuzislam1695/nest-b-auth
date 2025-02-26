import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Set the global prefix
  app.setGlobalPrefix('nest-b-auth/api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // ? Swagger setup

  const config = new DocumentBuilder()
    .setTitle('nest-b-auth')
    .setDescription('Api documentation for nest-b-auth Backend')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.getHttpAdapter().get('/', (req: Request, res: Response) => {
    res.send('nest-b-auth server');
  });

  await app.listen(process.env.PORT ?? 3332);
}
bootstrap();
