import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { LoggerService } from './common/logger/logger.service';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './utils/exceptionFilter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtAuthGuard } from './utils/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(LoggerService);
  const port = process.env.PORT;
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.setGlobalPrefix('api/v1');
  const config = new DocumentBuilder()
    .setTitle('DB BOOKS API')
    .setDescription('API DOCS FOR DB BOOKS')
    .setVersion('1.0')
    .addServer(`http://localhost:${port}/`, 'Local environment')
    .addServer(`http://192.168.20.210:${port}/`, 'Local Luqman')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  app.enableShutdownHooks();
  await app.listen(port);
  logger.log('Listening on ' + (await app.getUrl()));
}
bootstrap();
