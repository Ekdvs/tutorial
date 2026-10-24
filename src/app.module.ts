import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';
import {
  CacheInterceptor,
  CacheModule,
} from '@nestjs/cache-manager';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductModule } from './api/product/product.module.js';
import { UserModule } from './api/user/user.module.js';

export const { ObserveModule, ObserveInstrument } =
  createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    CacheModule.register({
      isGlobal: true,
      ttl: 5_000, // 5 seconds
      max: 10_000, // Maximum number of cached items
    }),

    ProductModule,
    UserModule,
  ],

  controllers: [AppController],

  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}