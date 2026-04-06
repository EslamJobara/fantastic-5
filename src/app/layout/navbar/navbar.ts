import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  showSearchBar = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Hide search bar on products page
        this.showSearchBar = !event.url.includes('/products');
      });
  }

  onSearch(query: string) {
    console.log('Search query:', query);
    // Add your search logic here
  }
}
