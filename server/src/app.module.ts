import { join } from 'path';

import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { NestjsFingerprintModule } from 'nestjs-fingerprint';

import { AppController } from './app.controller';
import AppService from './services/';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/uploads'),
    }),
    NestjsFingerprintModule.forRoot({
      params: ['headers', 'ipAddress', 'userAgent']
    }),
    ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [...AppService],
})

export class AppModule { }
