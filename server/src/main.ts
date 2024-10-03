import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('__dirname: ', __dirname);

  const app = await NestFactory.create(AppModule);

  app.enableCors(
    {
      allowedHeaders: ['content-type'],
      origin: 'http://localhost:5173',
      credentials: true,
    }
  )
  app.enableShutdownHooks();

  await app.listen(3000);
}

bootstrap();
