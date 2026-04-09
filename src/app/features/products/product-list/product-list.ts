import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../../core/services/product.service';
import { CategoryService, Category } from '../../../core/services/category.service';
import { CartService } from '../../../core/services/cart.service';

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
  selectedCategories: string[] = [];
  isLoadingProducts = true;
  isLoadingCategories = true;
  searchQuery: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortBy: string = 'newest'; // Default sort
  showToast = false;
  loadingProducts: Set<string> = new Set();
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 8;
  totalPages: number = 1;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
    
    // Check for search and category query parameters
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchQuery = params['search'];
      }
      if (params['category']) {
        const categoryParam = params['category'];
        this.selectedCategories = Array.isArray(categoryParam) ? categoryParam : [categoryParam];
      }
      if (params['search'] || params['category']) {
        this.applyFilters();
        this.cdr.detectChanges();
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
        this.allProducts = response.data;
        this.isLoadingProducts = false;
        this.applyFilters();
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
    if (categoryId === null) {
      this.selectedCategories = [];
    } else {
      const index = this.selectedCategories.indexOf(categoryId);
      if (index > -1) {
        this.selectedCategories.splice(index, 1);
      } else {
        this.selectedCategories.push(categoryId);
      }
    }
    this.currentPage = 1;
    this.applyFilters();
  }

  isCategorySelected(categoryId: string | null): boolean {
    if (categoryId === null) return this.selectedCategories.length === 0;
    return this.selectedCategories.includes(categoryId);
  }

  handleAddToCart(product: Product) {
    if (this.loadingProducts.has(product._id)) return;
    
    this.loadingProducts.add(product._id);
    this.cdr.detectChanges();

    this.cartService.addToCart(product._id).subscribe({
      next: () => {
        this.loadingProducts.delete(product._id);
        this.showToast = true;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.showToast = false;
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err: any) => {
        this.loadingProducts.delete(product._id);
        console.error('Failed to add to cart', err);
        this.cdr.detectChanges();
        alert('Failed to add product to cart. Please try again.');
      }
    });
  }

  handleViewDetails(product: Product) {
    this.router.navigate(['/products', product._id]);
  }

  handleSearch(query: string) {
    this.searchQuery = query;
    this.currentPage = 1; // Reset to first page
    this.applyFilters();
  }
  
  onPriceFilterChange() {
    this.currentPage = 1; // Reset to first page
    this.applyFilters();
  }
  
  onSortChange() {
    this.applySort();
  }
  
  applyFilters() {
    let filtered = [...this.allProducts];
    
    // Apply category multi-filter
    if (this.selectedCategories.length > 0) {
      filtered = filtered.filter(p => this.selectedCategories.includes(p.category));
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

    // Update total pages
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = 1;
    }

    // Apply sort before slicing for pagination
    this.applySortOnArray(filtered);

    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.products = filtered.slice(startIndex, startIndex + this.pageSize);
    
    this.cdr.detectChanges();
  }

  private applySortOnArray(arr: Product[]) {
    switch (this.sortBy) {
      case 'newest':
        arr.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case 'price-low':
        arr.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        arr.sort((a, b) => b.price - a.price);
        break;
    }
  }
  
  applySort() {
    this.applyFilters(); // Re-filter and re-paginate
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
