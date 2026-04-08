import { Component, OnInit, OnDestroy, ChangeDetectorRef, ElementRef, AfterViewInit, ViewChildren, QueryList } from '@angular/core';

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

  // Filter
  activeFilter = 'All';
  activeFilterIndex = 0;
  cardsVisible = true;
  pillWidth = 0;
  pillOffset = 6;
  readonly filters = ['All', 'Laptops', 'Audio', 'Wearables', 'Accessories'];

  @ViewChildren('filterBtn') filterBtns!: QueryList<ElementRef<HTMLButtonElement>>;

  readonly allProducts: Product[] = [
    { name: 'Acoustic One S',     price: '349',   category: 'Audio',       badge: 'New', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt3IPDTQqfHyO0t8SNj1_2hWSKxIJx8ZqqKv0Oq0R2-xCrfnauh5Lg2Qi9o3WaAQn3Ld8XpFDel7LTiKudVnU1c2jwsieuJLPgT6IS3a75HW30nSUfb-1VbL1YbR_BfYleAERvRR7I49AkWS3tj0zx0jPz7a5ao1ytmpHy0jnjKXwSgPgdYvdcluLxOjTxDq-9Bi9Y21ZjGBd0NFxc66eZ4kS3fR7DYFu_B9f5Ck5O45dgdgT-bWE0p6D9LokvPjUQQP-QrRW-HwrZ' },
    { name: 'Tactile Pro 65',     price: '189',   category: 'Accessories', badge: 'New', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgzI-k12xZsh-tvcHpRcvPQujNiNDaiPk8wFFtxbbTW98Lom5ZyeV71VAFuIuVMMA35n627WxXts4nyCUH_THBGaomTbnGWvzxfDVNGHVMYmNb8PPYEMDDa1llp1B7cCO3oh_mq6mRAwnFXp2YNM1c7oLIg8Idh6xLncXpZy-bAU11Hq4qesgJQQjzgoywpbIu8JivmAAtIXdwHgs1A04h_42aiOyGNDxexcV4bPmAJpfHyeNbXxr1twmUR6reCKpnJ0_2q_FZJi7j' },
    { name: 'Precision Point X',  price: '129',   category: 'Accessories', badge: 'New', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPAb30GV_tjPupieJLgZhi8KbhZJsqzKa4eLQG_kSGlANIdtGKvVd0HfcSjF4OZ8O3SLpqYCMiLKpPUeLt7Fd9JryXhErNiVVJnd-bGwm1XC29PB7y2nznA-L-yzVTmvf9OscSv8Cj2-M7Xan8c5vkOawwNSiRFN1t1yKzz2vqS2UyFL2PE34lPBPOefz0zy79rpEWuibHxvtfUOIlOCVSOFU5_wwuoBEbnHOqLTY2sMXcmJeQFzX_vOr52SFfmz7iaIvMvwSLzHyO' },
    { name: 'Canvas Air 12',      price: '899',   category: 'Laptops',     badge: 'New', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKjyV9zCxGA9bxRAHiS0FHb7cNju3XiTFQPPb2RzGujw5e0XB9C2tPAe3e4wUgSDSv8M-pL8NUJArvlhgmLpxthz5nNUSCyla-Yk67xjZgIFqEhbIexd4Bvx0zI9BWz0XgM-3aLQOg0H4bOhRkYi7_y_bVNl2lkCaZjPw6vRKD-mCwtuQG6bbZfwZU9ZKpcJgQh4cEk9N30F9lfAqH00Hh5A1Iczkxb6vk-QnNgWpJ1-r_Ef8FKhm2XDnBpeSnM8i64gAclFeLdX3g' },
    { name: 'Zenith Pro M3',      price: '1,299', category: 'Laptops',     badge: 'New', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjuqlsOmGJt0FEsFz4DG3FjJPShIO2wMvyHCT4p9p3Zf7olaG3fmW6Z1soWWq2tWmoDrTWoBfVpEsbT-6j7X4a_p5k19NBxDjyH4yWShQQDwvbS_LyBQinaneF0ObuL3jbjvgE5wYye0dh3D6gmAdAIYmB8B3GZ1jQ9Ixl0sY0xiacs-yHB-MkhLep-kReTTL4_YLde3080iRWGhjQ_qMfinL7nhdqYvxlGaVh_zkk9pY7bFEcDedi_9HMNEwqLnA0G41_Ewq2vebo' },
    { name: 'Curator Watch II',   price: '499',   category: 'Wearables',   badge: 'New', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKjyV9zCxGA9bxRAHiS0FHb7cNju3XiTFQPPb2RzGujw5e0XB9C2tPAe3e4wUgSDSv8M-pL8NUJArvlhgmLpxthz5nNUSCyla-Yk67xjZgIFqEhbIexd4Bvx0zI9BWz0XgM-3aLQOg0H4bOhRkYi7_y_bVNl2lkCaZjPw6vRKD-mCwtuQG6bbZfwZU9ZKpcJgQh4cEk9N30F9lfAqH00Hh5A1Iczkxb6vk-QnNgWpJ1-r_Ef8FKhm2XDnBpeSnM8i64gAclFeLdX3g' },
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.updatePill(0);
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

  get filteredProducts(): Product[] {
    return this.activeFilter === 'All'
      ? this.allProducts
      : this.allProducts.filter(p => p.category === this.activeFilter);
  }

  setFilter(filter: string, index: number) {
    if (filter === this.activeFilter) return;
    this.updatePill(index);
    this.cardsVisible = false;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.activeFilter = filter;
      this.activeFilterIndex = index;
      this.cardsVisible = true;
      this.cdr.detectChanges();
    }, 200);
  }

  ngOnInit() { this.startAutoAdvance(); }
  ngOnDestroy() { this.stopAutoAdvance(); }

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
