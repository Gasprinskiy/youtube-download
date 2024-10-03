import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import AppService from './services/';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/uploads'),
    }),
  ],
  controllers: [AppController],
  providers: [...AppService],
})
export class AppModule { }
