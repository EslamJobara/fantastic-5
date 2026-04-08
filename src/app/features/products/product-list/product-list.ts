import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../../core/services/product.service';
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
  isLoadingProducts = true;
  isLoadingCategories = true;
  searchQuery: string = '';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
    
    // Check for search query parameter
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchQuery = params['search'];
        this.applySearch();
      }
    });
  }

  loadCategories() {
    this.isLoadingCategories = true;
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
        this.isLoadingCategories = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.isLoadingCategories = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadProducts() {
    this.isLoadingProducts = true;
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.allProducts = response.data; // Store all products
        this.products = response.data; // Display all initially
        this.isLoadingProducts = false;
        // Apply search if query exists
        if (this.searchQuery) {
          this.applySearch();
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoadingProducts = false;
        this.cdr.detectChanges();
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

  handleViewDetails(product: Product) {
    // Navigate to product details page
    this.router.navigate(['/products', product._id]);
  }

  handleSearch(query: string) {
    this.searchQuery = query;
    this.applySearch();
  }
  
  applySearch() {
    if (this.searchQuery.trim()) {
      this.products = this.allProducts.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.products = this.allProducts;
    }
    this.cdr.detectChanges();
  }
}
