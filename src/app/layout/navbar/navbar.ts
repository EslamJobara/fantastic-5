import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  showSearchBar = true;
  isLoggedIn = false;
  showUserMenu = false;
  cartItemCount = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showSearchBar = !event.url.includes('/products');
      });
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    
    this.cartService.cart$.subscribe(cart => {
      this.cartItemCount = cart.items.reduce((count, item) => count + item.quantity, 0);
      this.cdr.detectChanges();
    });

    // Subscribe to auth changes
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user || this.authService.isLoggedIn();
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const userMenuContainer = target.closest('.user-menu-container');
    
    // لو الضغطة مش جوا الـ user menu container، قفل الـ menu
    if (!userMenuContainer && this.showUserMenu) {
      this.showUserMenu = false;
    }
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
    if (query.trim()) {
      this.router.navigate(['/products'], { queryParams: { search: query } });
    }
  }
}
