import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(
    {
      allowedHeaders: ['content-type'],
      origin: 'http://localhost',
      credentials: true,
    }
  )
  app.enableShutdownHooks();

  await app.listen(3000);
}

bootstrap();
