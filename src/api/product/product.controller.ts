import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';

import {
  Product,
  ProductService,
} from './product.service.js';
import { AllProductResponse } from './dto/product-response.js';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
  ) {}

  @Get('all-products')
  getAllProducts(): Promise<AllProductResponse> {
    return this.productService.getAllProducts();
  }

  @Get('get-product/:productId')
  getProductById(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<Product> {
    console.log('productId:', productId);

    return this.productService.getProductById(productId);
  }

  @Post('add-product')
  createProduct(
    @Body() product: Omit<Product, 'id'>,
  ): Promise<Product> {
    console.log('product:', product);

    return this.productService.createProduct(product);
  }

  @Put('update-product/:productId')
  updateProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() product: Omit<Product, 'id'>,
  ): Promise<Product> {
    return this.productService.updateProduct(
      productId,
      product,
    );
  }

  @Delete('delete-product/:productId')
  async deleteProduct(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<{ message: string }> {
    await this.productService.deleteProduct(productId);

    return {
      message: `Product with ID ${productId} deleted successfully`,
    };
  }
}