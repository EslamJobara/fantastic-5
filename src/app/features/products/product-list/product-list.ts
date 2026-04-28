import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { CartService } from '../../../core/services/cart.service';
import { Product, Category } from '@core/models';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  allProducts: Product[] = [];
  categories: Category[] = [];
  selectedCategory: string | null = null;
  isLoadingProducts = true;
  isLoadingCategories = true;
  searchQuery: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortBy: string = 'newest';
  currentPage = 1;
  readonly itemsPerPage = 6;
  addingToCartMap: Record<string, boolean> = {};
  addToCartSuccessMap: Record<string, boolean> = {};
  addToCartErrorMap: Record<string, string | null> = {};

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
    
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

  handleAddToCart(product: Product) {
    const productId = product?._id;
    if (!productId || this.addingToCartMap[productId]) {
      return;
    }

    const defaultVariationId = product.variations?.find(v => v.isDefault)?._id || product.variations?.[0]?._id;

    this.addingToCartMap[productId] = true;
    this.addToCartErrorMap[productId] = null;
    this.addToCartSuccessMap[productId] = false;
    this.cdr.detectChanges();

    this.cartService.addToCart(productId, 1, defaultVariationId).subscribe({
      next: () => {
        this.addingToCartMap[productId] = false;
        this.addToCartSuccessMap[productId] = true;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.addingToCartMap[productId] = false;
        this.addToCartErrorMap[productId] = error?.error?.message || 'Failed to add item to cart';
        this.cdr.detectChanges();
      }
    });
  }

  handleViewDetails(product: Product) {
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
    
    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }
    
    if (this.searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    
    if (this.minPrice !== null && this.minPrice >= 0) {
      filtered = filtered.filter(p => p.price >= this.minPrice!);
    }
    if (this.maxPrice !== null && this.maxPrice >= 0) {
      filtered = filtered.filter(p => p.price <= this.maxPrice!);
    }
    
    this.products = filtered;
    this.currentPage = 1;
    this.applySort();
  }
  
  applySort() {
    switch (this.sortBy) {
      case 'newest':
        this.products.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
        break;
      case 'price-low':
        this.products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        this.products.sort((a, b) => b.price - a.price);
        break;
    }
    this.currentPage = 1;
    this.cdr.detectChanges();
  }

  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.products.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.products.length / this.itemsPerPage));
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    this.currentPage = page;
    this.cdr.detectChanges();
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }
}
