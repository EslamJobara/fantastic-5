import { Component, OnInit, OnDestroy, ChangeDetectorRef, ElementRef, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { ProductService, Product as ApiProduct } from '../../../core/services/product.service';
import { CategoryService, Category } from '../../../core/services/category.service';

export interface Product {
  name: string;
  desc?: string;
  price: string;
  category: string;
  badge: string;
  img: string;
}

export interface HeroSlide {
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

  // Hero Slides Data - جاهز للربط بالباك
  readonly heroSlides: HeroSlide[] = [
    {
      badge: 'NEW ARRIVAL',
      badgeClass: 'bg-primary/10 text-primary',
      hasAnimation: true,
      title: 'Zenith',
      titleGradient: 'Pro M3.',
      description: 'Engineered for curators who demand atmospheric precision. 24-hour battery life encased in aerospace-grade titanium.',
      primaryButton: 'Shop Zenith',
      secondaryButton: 'Specifications',
      image: '/pics/lap.png',
      imageAlt: 'Zenith Pro M3 Laptop',
      imageClass: 'w-full'
    },
    {
      badge: 'PURE SOUND',
      badgeClass: 'bg-on-surface/10 text-on-surface',
      title: 'Sonic',
      titleGradient: 'Ultra X.',
      description: 'Experience atmospheric silence with industry-leading active noise cancellation and spatial acoustic drivers.',
      primaryButton: 'Explore Sound',
      image: '/pics/headphone.png',
      imageAlt: 'Sonic Ultra X Headphones',
      imageClass: 'w-3/4'
    },
    {
      badge: 'PRECISION TRACKING',
      badgeClass: 'bg-primary/10 text-primary',
      title: 'Curator',
      titleGradient: 'Watch.',
      description: 'The ultimate companion for the modern professional. Seamlessly syncing your digital life with sapphire-glass elegance.',
      primaryButton: 'Pre-order Now',
      image: '/pics/watch.png',
      imageAlt: 'Curator Watch II',
      imageClass: 'w-2/3'
    }
  ];

  // Filter - API Data
  categories: Category[] = [];
  allProducts: ApiProduct[] = [];
  selectedCategoryId: string | null = null;
  activeFilterIndex = 0;
  cardsVisible = true;
  pillWidth = 0;
  pillOffset = 6;

  @ViewChildren('filterBtn') filterBtns!: QueryList<ElementRef<HTMLButtonElement>>;

  constructor(
    private cdr: ChangeDetectorRef,
    private productService: ProductService,
    private categoryService: CategoryService
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
        // Update pill after categories load
        setTimeout(() => this.updatePill(0), 100);
      },
      error: (error) => {
      }
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.allProducts = response.data;
        this.cdr.detectChanges();
      },
      error: (error) => {
      }
    });
  }

  private updatePill(index: number) {
    const btns = this.filterBtns?.toArray();
    if (!btns?.length) return;
    const btn = btns[index]?.nativeElement;
    if (!btn) return;
    this.pillWidth = btn.offsetWidth;
    let offset = 6;
    for (let i = 0; i < index; i++) {
      offset += btns[i].nativeElement.offsetWidth;
    }
    this.pillOffset = offset;
    this.cdr.detectChanges();
  }

  get filteredProducts(): ApiProduct[] {
    const filtered = this.selectedCategoryId
      ? this.allProducts.filter(p => p.category === this.selectedCategoryId)
      : this.allProducts;
    
    // Return only first 4 products
    return filtered.slice(0, 4);
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
      this.cdr.detectChanges();
    }, 200);
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

  // Helper للحصول على الـ gradient class
  getTitleGradientClass(index: number): string {
    const gradients = [
      'from-slate-400 to-slate-600',
      'from-slate-500 to-slate-800',
      'from-blue-400 to-blue-600'
    ];
    return gradients[index % gradients.length];
  }
}
