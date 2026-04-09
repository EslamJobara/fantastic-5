import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductService, Product } from '../../../core/services/product.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar implements OnInit, OnDestroy {
  @Input() placeholder: string = 'Search...';
  @Input() width: string = 'w-64';
  @Input() variant: 'navbar' | 'page' = 'navbar';
  @Input() showDropdown: boolean = true; // Control dropdown visibility
  @Input() set searchValue(value: string) {
    this._searchValue = value;
  }
  get searchValue(): string {
    return this._searchValue;
  }
  @Output() search = new EventEmitter<string>();
  
  private _searchValue: string = '';
  searchResults: Product[] = [];
  isSearching = false;
  showResults = false;
  
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  
  constructor(
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit() {
    // Setup debounced search
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(1000), // Wait 1 second after user stops typing
      distinctUntilChanged() // Only emit if value changed
    ).subscribe(searchTerm => {
      this.performSearch(searchTerm);
    });
  }
  
  ngOnDestroy() {
    this.searchSubscription?.unsubscribe();
  }
  
  onInputChange() {
    // Emit search event immediately for page variant without dropdown
    if (!this.showDropdown) {
      this.search.emit(this.searchValue);
      return;
    }
    
    if (this.searchValue.trim().length === 0) {
      this.searchResults = [];
      this.showResults = false;
      this.isSearching = false;
      return;
    }
    
    this.isSearching = true;
    this.searchSubject.next(this.searchValue);
  }
  
  performSearch(searchTerm: string) {
    if (!searchTerm.trim()) {
      this.searchResults = [];
      this.showResults = false;
      this.isSearching = false;
      return;
    }
    
    this.productService.getProducts().subscribe({
      next: (response) => {
        // Filter products by search term (name or description)
        const filtered = response.data.filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        // Take only first 3 results
        this.searchResults = filtered.slice(0, 3);
        this.showResults = true;
        this.isSearching = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Search error:', error);
        this.isSearching = false;
        this.cdr.detectChanges();
      }
    });
  }
  
  onSearch() {
    this.search.emit(this._searchValue);
  }
  
  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (this.showDropdown) {
        this.viewAllResults();
      } else {
        this.search.emit(this.searchValue);
      }
    }
  }
  
  viewAllResults() {
    if (this.searchValue.trim()) {
      this.router.navigate(['/products'], { 
        queryParams: { search: this.searchValue } 
      });
      this.closeResults();
    }
  }
  
  goToProduct(productId: string) {
    this.router.navigate(['/products', productId]);
    this.closeResults();
  }
  
  closeResults() {
    this.showResults = false;
    this.searchResults = [];
  }
}
