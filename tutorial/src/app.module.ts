import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { NoCacheInterceptor } from './interceptor/no-cache.interceptor.js';
import { createObserveModule } from '@nestjs/observe';


import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductModule } from './api/product/product.module.js';
import { UserModule } from './api/user/user.module.js';
import { ConfigModule } from '@nestjs/config';

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
      useClass: NoCacheInterceptor,
    },
  ],
})
export class AppModule {}