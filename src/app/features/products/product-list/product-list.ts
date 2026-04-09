import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { Product, Category } from '@core/models';

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
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortBy: string = 'newest'; // Default sort

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
        this.applyFilters();
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
        this.isLoadingCategories = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadProducts() {
    this.isLoadingProducts = true;
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.allProducts = response.data;
        this.products = response.data;
        this.isLoadingProducts = false;
        if (this.searchQuery || this.selectedCategory || this.minPrice !== null || this.maxPrice !== null) {
          this.applyFilters();
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoadingProducts = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterByCategory(categoryId: string | null) {
    this.selectedCategory = categoryId;
    this.applyFilters();
    this.cdr.detectChanges();
  }

  handleAddToCart(product: any) {
    // TODO: Add cart logic here
  }

  handleViewDetails(product: Product) {
    // Navigate to product details page
    this.router.navigate(['/products', product._id]);
  }

  handleSearch(query: string) {
    this.searchQuery = query;
    this.applyFilters();
  }
  
  onPriceFilterChange() {
    this.applyFilters();
  }
  
  onSortChange() {
    this.applySort();
  }
  
  applyFilters() {
    let filtered = [...this.allProducts];
    
    // Apply category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }
    
    // Apply search filter
    if (this.searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    
    // Apply price range filter
    if (this.minPrice !== null && this.minPrice >= 0) {
      filtered = filtered.filter(p => p.price >= this.minPrice!);
    }
    if (this.maxPrice !== null && this.maxPrice >= 0) {
      filtered = filtered.filter(p => p.price <= this.maxPrice!);
    }
    
    this.products = filtered;
    this.applySort();
  }
  
  applySort() {
    switch (this.sortBy) {
      case 'newest':
        // Sort by createdAt descending (newest first)
        this.products.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
        break;
      case 'price-low':
        // Sort by price ascending (low to high)
        this.products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        // Sort by price descending (high to low)
        this.products.sort((a, b) => b.price - a.price);
        break;
    }
    this.cdr.detectChanges();
  }
}
