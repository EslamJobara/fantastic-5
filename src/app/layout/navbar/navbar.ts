import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';

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
  showMobileMenu = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showSearchBar = !event.url.includes('/products');
        this.showMobileMenu = false;
        this.showUserMenu = false;
      });
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user || this.authService.isLoggedIn();
    });
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

  toggleUserMenu(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    this.authService.logout();
    this.showUserMenu = false;
    this.showMobileMenu = false;
  }

  toggleMobileMenu(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.showMobileMenu = !this.showMobileMenu;
  }

  onSearch(query: string) {
  }
}
