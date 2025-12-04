import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend communication
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('BizFlow API')
    .setDescription('BizFlow business management platform API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('contacts', 'Contact/CRM endpoints')
    .addTag('leads', 'Sales leads endpoints')
    .addTag('quotes', 'Quote management endpoints')
    .addTag('invoices', 'Invoice management endpoints')
    .addTag('products', 'Product catalog endpoints')
    .addTag('projects', 'Project management endpoints')
    .addTag('tasks', 'Task management endpoints')
    .addTag('employees', 'HR/Employee endpoints')
    .addTag('expenses', 'Expense tracking endpoints')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Backend is running on: http://localhost:${port}`);
  console.log(`📚 API docs available at: http://localhost:${port}/api/docs`);
}
bootstrap();

