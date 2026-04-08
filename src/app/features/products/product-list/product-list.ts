import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response.data;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  handleAddToCart(product: any) {
    console.log('Add to cart:', product);
    // Add your cart logic here
  }

  handleViewDetails(product: any) {
    console.log('View details:', product);
    // Navigate to product details
  }

  handleSearch(query: string) {
    console.log('Search query:', query);
    // Add your search/filter logic here
  }
}
