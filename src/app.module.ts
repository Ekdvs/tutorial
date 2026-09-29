import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductModule } from './api/product/product.module.js';
import { UserModule } from './api/user/user.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ProductModule,

    UserModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}