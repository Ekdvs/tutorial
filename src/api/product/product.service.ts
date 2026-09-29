import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../config/prisma/prisma.service.js';
import { AllProductResponse } from './dto/product-response.js';

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  rating: number;
};

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================
  // GET ALL PRODUCTS
  // =========================
  async getAllProducts(): Promise<AllProductResponse> {
    try {
      return {
        products: await this.prisma.product.findMany({
          orderBy: {
            id: 'asc',
          },
        }),
      };
    } catch (error) {
      console.error('Error fetching products:', error);

      throw new InternalServerErrorException(
        'Failed to fetch products',
      );
    }
  }

  // =========================
  // GET PRODUCT BY ID
  // =========================
  async getProductById(id: number): Promise<Product> {
    try {
      const product = await this.prisma.product.findUnique({
        where: {
          id,
        },
      });

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${id} not found`,
        );
      }

      return product;
    } catch (error) {
      // Preserve NestJS 404 exception
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error(
        `Error fetching product ${id}:`,
        error,
      );

      throw new InternalServerErrorException(
        'Failed to fetch product',
      );
    }
  }

  // =========================
  // CREATE PRODUCT
  // =========================
  async createProduct(
    product: Omit<Product, 'id'>,
  ): Promise<Product> {
    try {
      return await this.prisma.product.create({
        data: {
          name: product.name,
          price: product.price,
          image: product.image,
          description: product.description,
          rating: product.rating,
        },
      });
    } catch (error) {
      console.error('Error creating product:', error);

      throw new InternalServerErrorException(
        'Failed to create product',
      );
    }
  }

  // =========================
  // UPDATE PRODUCT
  // =========================
  async updateProduct(
    id: number,
    updatedProduct: Omit<Product, 'id'>,
  ): Promise<Product> {
    try {
      // Check if product exists
      await this.getProductById(id);

      return await this.prisma.product.update({
        where: {
          id,
        },
        data: {
          name: updatedProduct.name,
          price: updatedProduct.price,
          image: updatedProduct.image,
          description: updatedProduct.description,
          rating: updatedProduct.rating,
        },
      });
    } catch (error) {
      // Preserve NestJS 404 exception
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error(
        `Error updating product ${id}:`,
        error,
      );

      throw new InternalServerErrorException(
        'Failed to update product',
      );
    }
  }

  // =========================
  // DELETE PRODUCT
  // =========================
  async deleteProduct(id: number): Promise<void> {
    try {
      // Check if product exists
      await this.getProductById(id);

      await this.prisma.product.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      // Preserve NestJS 404 exception
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error(
        `Error deleting product ${id}:`,
        error,
      );

      throw new InternalServerErrorException(
        'Failed to delete product',
      );
    }
  }
}