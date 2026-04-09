import { Component, OnInit, OnDestroy, ChangeDetectorRef, ElementRef, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { Product as ApiProduct, Category } from '@core/models';

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
  productLink?: string;
}

@Component({
  selector: 'app-landing',
  standalone: false,
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class LandingComponent implements OnInit, OnDestroy, AfterViewInit {
  currentSlide = 0;
  readonly totalSlides = 3;
  trackIndex = 1;
  isAnimating = false;
  transitionEnabled = true;
  private autoAdvanceTimer: any;

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
      imageClass: 'w-full',
      productLink: '/products/69d81a7dcaf394a614f441c6'
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
      imageClass: 'w-3/4',
      productLink: '/products/69d81acfcaf394a614f441e7'
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
      imageClass: 'w-2/3',
      productLink: '/products/69d81afecaf394a614f441f2'
    }
  ];

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
    private categoryService: CategoryService,
    private router: Router
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
        this.categories = response.data.slice(0, 4);
        this.cdr.detectChanges();
        setTimeout(() => this.updatePill(0), 100);
      },
      error: () => {}
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (response) => {
        // Filter featured products that are visible and not deleted
        this.allProducts = response.data.filter(
          product => product.featured === true && 
                     product.visible !== false && 
                     product.isDeleted !== true
        );
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  private updatePill(index: number) {
    const btns = this.filterBtns?.toArray();
    if (!btns?.length) return;
    
    const btn = btns[index]?.nativeElement;
    if (!btn) return;

    this.pillWidth = btn.offsetWidth;
    this.pillOffset = 6 + btns.slice(0, index).reduce((sum, b) => sum + b.nativeElement.offsetWidth, 0);
    this.cdr.detectChanges();
  }

  get filteredProducts(): ApiProduct[] {
    const filtered = this.selectedCategoryId
      ? this.allProducts.filter(p => p.category === this.selectedCategoryId)
      : this.allProducts;
    
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

  getTitleGradientClass(index: number): string {
    const gradients = [
      'from-slate-400 to-slate-600',
      'from-slate-500 to-slate-800',
      'from-blue-400 to-blue-600'
    ];
    return gradients[index % gradients.length];
  }

  navigateToProduct(productLink?: string) {
    if (productLink) {
      this.router.navigate([productLink]);
    }
  }
}
