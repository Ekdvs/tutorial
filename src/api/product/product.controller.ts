import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { Product, ProductService } from './product.service.js';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Get('all-products')
  getAllProducts(): Product[] {
    return this.productService.getAllProducts();
  }

  @Get('get-product/:productId')
  getProductById(@Param('productId') productId: number): Product | undefined {
    console.log('productId', productId);
    return this.productService.getProductById(productId);
  }

  @Post('add-product')
  createProduct(@Body() product: any): any {
    console.log('product', product);
    return this.productService.createProduct(product);

  }

  @Put('update-product/:productId')
  updateProduct(@Param('productId', ParseIntPipe) productId: number, @Body() product: any): Product | undefined {
    return this.productService.updateProduct(productId, product);
  }

  @Delete('delete-product/:productId')
  deleteProduct(@Param('productId', ParseIntPipe) productId: number): void {
    this.productService.deleteProduct(productId);
  }
}