import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  showSearchBar = true;
  isLoggedIn = false;
  showUserMenu = false;
  showMobileMenu = false;
  cartItemCount = 0;
  
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: any) => {
        // Hide search bar on products page
        this.showSearchBar = !event.url.includes('/products');
      });
  }

  ngOnInit() {
    // Check login status
    this.isLoggedIn = this.authService.isLoggedIn();
    
    // Subscribe to auth changes
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.isLoggedIn = !!user || this.authService.isLoggedIn();
        this.cdr.detectChanges();
      });

    // Subscribe to cart changes
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cart => {
        this.cartItemCount = cart.items.reduce((count, item) => count + item.quantity, 0);
        console.log('Cart item count updated:', this.cartItemCount, 'items:', cart.items);
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const userMenuContainer = target.closest('.user-menu-container');
    const mobileMenuContainer = target.closest('.mobile-menu-container');
    
    if (!userMenuContainer && this.showUserMenu) {
      this.showUserMenu = false;
    }
    
    if (!mobileMenuContainer && this.showMobileMenu) {
      this.showMobileMenu = false;
    }
  }

  toggleMobileMenu(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.showMobileMenu = !this.showMobileMenu;
  }

  closeMobileMenu() {
    this.showMobileMenu = false;
  }

  toggleUserMenu(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    this.authService.logout();
    this.showUserMenu = false;
  }

  onSearch(query: string) {
    // TODO: Implement search logic
  }
}
