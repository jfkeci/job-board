import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ConfigService } from '@borg/config';
import {
  LoggerService,
  createValidationExceptionFactory,
} from '@borg/backend-lib';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Get services from DI container
  const configService = app.get(ConfigService);
  const logger = app.get(LoggerService);

  // Use custom logger
  app.useLogger(logger);

  // Get configuration values
  const port = configService.port;
  const apiPrefix = configService.apiPrefix;
  const isProduction = configService.isProduction;

  // Set global API prefix
  app.setGlobalPrefix(apiPrefix);

  // Configure CORS
  app.enableCors({
    origin: isProduction
      ? [/\.borg\.com$/] // Restrict to borg.com domains in production
      : true, // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Correlation-Id',
      'X-Tenant-Id',
      'X-Language',
    ],
  });

  // Configure global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: createValidationExceptionFactory(),
    }),
  );

  // Configure Swagger documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Borg API')
    .setDescription('Multi-tenant Job Board REST API')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token',
      },
      'JWT-auth',
    )
    .addTag('Health', 'Health check endpoints')
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Jobs', 'Job management endpoints')
    .addTag('Applications', 'Job application endpoints')
    .addTag('Organizations', 'Organization management endpoints')
    .addTag('Users', 'User management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // Enable graceful shutdown hooks
  app.enableShutdownHooks();

  // Start server
  await app.listen(port);

  // Log startup information
  logger.log(`Environment: ${configService.nodeEnv}`, 'Bootstrap');
  logger.log(
    `API running on: http://localhost:${port}/${apiPrefix}`,
    'Bootstrap',
  );
  logger.log(
    `Swagger docs: http://localhost:${port}/${apiPrefix}/docs`,
    'Bootstrap',
  );
  logger.log(
    `Health check: http://localhost:${port}/${apiPrefix}/health`,
    'Bootstrap',
  );
}

void bootstrap();
