import { Module } from '@nestjs/common';

import { ProductService } from './product.service.js';
import { ProductController } from './product.controller.js';
import { PrismaModule } from '../../config/prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}