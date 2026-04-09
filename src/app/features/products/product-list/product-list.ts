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
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  categories: Category[] = [];
  selectedCategory: string | null = null;
  isLoadingProducts = true;
  isLoadingCategories = true;
  searchQuery: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortBy: string = 'newest';
  showFilters = false;
  
  currentPage: number = 1;
  itemsPerPage: number = 9;
  totalPages: number = 1;
  
  addingToCart: { [key: string]: boolean } = {};
  addedToCart: { [key: string]: boolean } = {};

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
        // Filter out products that are not visible or deleted
        const visibleProducts = response.data.filter(
          product => product.visible !== false && product.isDeleted !== true
        );
        this.allProducts = visibleProducts;
        this.products = visibleProducts;
        this.isLoadingProducts = false;
        if (this.searchQuery || this.selectedCategory || this.minPrice !== null || this.maxPrice !== null) {
          this.applyFilters();
        } else {
          this.filteredProducts = [...this.products];
          this.updatePagination();
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
    if (this.addingToCart[product._id] || this.addedToCart[product._id]) {
      return;
    }

    this.addingToCart[product._id] = true;
    this.addedToCart[product._id] = false;
    this.cdr.detectChanges();

    // Get default variation if exists
    const defaultVariation = product.variations?.find(v => v.isDefault) || product.variations?.[0];

    this.cartService.addToCart(product._id, 1, defaultVariation?._id).subscribe({
      next: () => {
        this.addingToCart[product._id] = false;
        this.addedToCart[product._id] = true;
        this.cdr.detectChanges();

        // Reset success state after 2 seconds
        setTimeout(() => {
          this.addedToCart[product._id] = false;
          this.cdr.detectChanges();
        }, 2000);
      },
      error: (error) => {
        console.error('Failed to add to cart', error);
        this.addingToCart[product._id] = false;
        this.addedToCart[product._id] = false;
        this.cdr.detectChanges();
      }
    });
  }

  isAddingToCart(productId: string): boolean {
    return this.addingToCart[productId] || false;
  }

  isAddedToCart(productId: string): boolean {
    return this.addedToCart[productId] || false;
  }

  handleViewDetails(product: Product) {
    // Navigate to product details page
    this.router.navigate(['/products', product._id]);
  }

  handleSearch(query: string) {
    this.searchQuery = query;
    this.applyFilters();
  }
  
  toggleFilters() {
    this.showFilters = !this.showFilters;
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
    this.filteredProducts = [...this.products];
    this.currentPage = 1; // Reset to first page when sorting
    this.updatePagination();
    this.cdr.detectChanges();
  }
  
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }
  
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
      this.cdr.detectChanges();
      // Scroll to top of products
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  
  nextPage() {
    this.goToPage(this.currentPage + 1);
  }
  
  previousPage() {
    this.goToPage(this.currentPage - 1);
  }
  
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    if (this.totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show current page and surrounding pages
      let startPage = Math.max(1, this.currentPage - 2);
      let endPage = Math.min(this.totalPages, this.currentPage + 2);
      
      // Adjust if we're near the start or end
      if (this.currentPage <= 3) {
        endPage = maxPagesToShow;
      } else if (this.currentPage >= this.totalPages - 2) {
        startPage = this.totalPages - maxPagesToShow + 1;
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }
}
