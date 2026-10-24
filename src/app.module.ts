import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductModule } from './api/product/product.module.js';
import { UserModule } from './api/user/user.module.js';
import { CacheModule } from '@nestjs/cache-manager';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ProductModule,

    UserModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 1000*5, 
      max: 1000*10,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
