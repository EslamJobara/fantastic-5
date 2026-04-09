import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CategoryService, Category } from '../../core/services/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer implements OnInit {
  categories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load categories for footer', err)
    });
  }

  navigateToCategory(categoryId: string) {
    this.router.navigate(['/products'], { queryParams: { category: categoryId } });
  }
}
