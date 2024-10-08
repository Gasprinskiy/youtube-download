import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { getCorsOrigin } from './shared/utils/env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(
    {
      allowedHeaders: ['content-type'],
      origin: getCorsOrigin(),
      credentials: true,
    }
  )
  app.enableShutdownHooks();

  await app.listen(3000);
}

bootstrap();
