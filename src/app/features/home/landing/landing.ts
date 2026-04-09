import { Component, OnInit, OnDestroy, ChangeDetectorRef, ElementRef, AfterViewInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { ProductService, Product } from '../../../core/services/product.service';
import { CategoryService, Category } from '../../../core/services/category.service';
import { CartService } from '../../../core/services/cart.service';
import { Router } from '@angular/router';

export interface HeroSlide {
  productId: string;
  badge: string;
  badgeClass: string;
  hasAnimation?: boolean;
  title: string;
  titleGradient: string;
  description: string;
  primaryButton: string;
  secondaryButton?: string;
  image: string;
  imageAlt: string;
  imageClass?: string;
}

@Component({
  selector: 'app-landing',
  standalone: false,
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class LandingComponent implements OnInit, OnDestroy, AfterViewInit {
  // Carousel
  currentSlide = 0;
  readonly totalSlides = 3;
  trackIndex = 1;
  isAnimating = false;
  transitionEnabled = true;
  private autoAdvanceTimer: any;

  // Hero Slides Data
  heroSlides: HeroSlide[] = [];

  // Filter - API Data
  categories: Category[] = [];
  allProducts: Product[] = [];
  selectedCategoryId: string | null = null;
  activeFilterIndex = 0;
  cardsVisible = true;
  pillWidth = 0;
  pillOffset = 6;
  showToast = false;
  loadingProducts: Set<string> = new Set();

  // Product Slider context
  @ViewChild('productGrid') productGrid!: ElementRef;
  @ViewChildren('filterBtn') filterBtns!: QueryList<ElementRef<HTMLButtonElement>>;

  constructor(
    private cdr: ChangeDetectorRef,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    public router: Router
  ) {}

  ngAfterViewInit() {
    this.updatePill(0);
  }

  ngOnInit() {
    this.startAutoAdvance();
    this.loadCategories();
    this.loadProducts();
  }

  ngOnDestroy() {
    this.stopAutoAdvance();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
        this.cdr.detectChanges();
        setTimeout(() => this.updatePill(0), 100);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.allProducts = response.data;
        if (this.allProducts.length > 0) {
          this.generateHeroSlides();
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  private generateHeroSlides() {
    const productsForHero = this.allProducts.slice(0, 3);
    
    this.heroSlides = productsForHero.map((product, index) => {
      const nameParts = product.name.split(' ');
      const title = nameParts[0];
      const titleGradient = nameParts.slice(1).join(' ');

      return {
        productId: product._id,
        badge: index === 0 ? 'FEATURED PRODUCT' : 'NEW ARRIVAL',
        badgeClass: index === 0 ? 'bg-primary/10 text-primary' : 'bg-on-surface/10 text-on-surface',
        hasAnimation: index === 0,
        title: title,
        titleGradient: titleGradient || 'Edition',
        description: product.description.length > 120 
          ? product.description.substring(0, 120) + '...' 
          : product.description,
        primaryButton: 'Buy Now - EGP ' + product.price,
        image: product.image,
        imageAlt: product.name,
        imageClass: index === 0 ? 'w-full' : 'w-3/4'
      };
    });
  }

  buyNow(productId: string) {
    this.cartService.addToCart(productId).subscribe({
      next: () => {
        this.router.navigate(['/cart']);
      },
      error: (err) => console.error('Failed to buy now', err)
    });
  }

  viewDetails(productId: string) {
    this.router.navigate(['/products', productId]);
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

  // New: Scroll logic for products lineup
  scrollLineup(direction: number) {
    const container = this.productGrid.nativeElement;
    const scrollAmount = 300; // Adjust as needed
    container.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  }

  private updatePill(index: number) {
    const btns = this.filterBtns?.toArray();
    if (!btns?.length) return;
    const btn = btns[index]?.nativeElement;
    if (!btn) return;
    
    this.pillWidth = btn.offsetWidth;
    this.pillOffset = btn.offsetLeft;
    this.cdr.detectChanges();
  }

  get filteredProducts(): Product[] {
    const filtered = this.selectedCategoryId
      ? this.allProducts.filter(p => p.category === this.selectedCategoryId)
      : this.allProducts;
    
    // Show up to 10 products in the slider
    return filtered.slice(0, 10);
  }

  setFilter(categoryId: string | null, index: number) {
    if (categoryId === this.selectedCategoryId) return;
    this.updatePill(index);
    this.cardsVisible = false;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.selectedCategoryId = categoryId;
      this.activeFilterIndex = index;
      this.cardsVisible = true;
      // Reset scroll when filter changes
      if (this.productGrid) {
        this.productGrid.nativeElement.scrollTo({ left: 0, behavior: 'auto' });
      }
      this.cdr.detectChanges();
    }, 50);
  }

  get trackTransform(): string {
    return `translateX(-${this.trackIndex * 100}%)`;
  }

  moveSlide(direction: number) {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.transitionEnabled = true;
    this.trackIndex += direction;
    this.currentSlide = ((this.trackIndex - 1) % this.totalSlides + this.totalSlides) % this.totalSlides;
    this.stopAutoAdvance();
    this.startAutoAdvance();
  }

  goToSlide(index: number) {
    if (this.isAnimating || index === this.currentSlide) return;
    this.isAnimating = true;
    this.transitionEnabled = true;
    this.trackIndex = index + 1;
    this.currentSlide = index;
    this.stopAutoAdvance();
    this.startAutoAdvance();
  }

  onTransitionEnd(event: TransitionEvent) {
    if (event.propertyName !== 'transform') return;
    if ((event.target as HTMLElement).dataset['slider'] !== 'track') return;
    this.isAnimating = false;
    if (this.trackIndex === this.totalSlides + 1) {
      this.transitionEnabled = false;
      this.trackIndex = 1;
      this.currentSlide = 0;
      return;
    }
    if (this.trackIndex === 0) {
      this.transitionEnabled = false;
      this.trackIndex = this.totalSlides;
      this.currentSlide = this.totalSlides - 1;
    }
  }

  private startAutoAdvance() {
    this.autoAdvanceTimer = setInterval(() => this.moveSlide(1), 4000);
  }

  private stopAutoAdvance() {
    clearInterval(this.autoAdvanceTimer);
  }

  getTitleGradientClass(index: number): string {
    const gradients = [
      'from-slate-400 to-slate-600',
      'from-slate-500 to-slate-800',
      'from-blue-400 to-blue-600'
    ];
    return gradients[index % gradients.length];
  }
}
