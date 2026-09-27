import { Injectable, NotFoundException } from '@nestjs/common';

export type Product = {
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
    rating: number;
}
@Injectable()
export class ProductService {
    private products: Product[] = [];

    getAllProducts(): Product[] {
        return this.products;
    }

    getProductById(id: number): Product | undefined {
        return this.products.find(product => product.id === id);
    }

    createProduct(product: Product): Product {
        const newId = this.products.length + 1;
        const newProduct = { ...product, id: newId };

        this.products.push(newProduct);

        return newProduct;
    }

    updateProduct(id: number, updatedProduct: Product): Product | undefined {
        const existingProduct = this.getProductById(id);

        if (existingProduct) {
            // Update the existing product with the new data
            existingProduct.name = updatedProduct.name;
            existingProduct.price = updatedProduct.price;
            existingProduct.image = updatedProduct.image;
            existingProduct.description = updatedProduct.description;
            existingProduct.rating = updatedProduct.rating;
        }
        else{
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return existingProduct;
    }

    deleteProduct(id: number): void {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
        } else {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
    }

}
