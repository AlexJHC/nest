import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const port = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Nest')
    .setDescription('Nest, typeORM, Docker, Swagger test project')
    .setVersion('1.0.0')
    .build();
  const documnet = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, documnet);

  await app.listen(port, () => console.log(`Server started on port ${port}`));
}

bootstrap();
