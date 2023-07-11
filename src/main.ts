import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ExceptionsFilter } from './http-exception.filter';

async function bootstrap() {
  const port = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);

  const config = new DocumentBuilder()
    .setTitle('Nest')
    .setDescription('Nest, typeORM, Docker, Swagger test project')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ExceptionsFilter(httpAdapter));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(port, () => console.log(`Server started on port ${port}`));
}

bootstrap();
