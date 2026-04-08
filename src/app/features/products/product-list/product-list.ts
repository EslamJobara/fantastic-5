import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductService, Product } from '../services/product.service';
import { CategoryService, Category } from '../../../core/services/category.service';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  allProducts: Product[] = []; // Store all products for filtering
  categories: Category[] = [];
  selectedCategory: string | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.allProducts = response.data; // Store all products
        this.products = response.data; // Display all initially
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  filterByCategory(categoryId: string | null) {
    this.selectedCategory = categoryId;
    
    if (categoryId) {
      // Filter from stored products (no API call)
      this.products = this.allProducts.filter(p => p.category === categoryId);
    } else {
      // Show all products
      this.products = this.allProducts;
    }
    this.cdr.detectChanges();
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
