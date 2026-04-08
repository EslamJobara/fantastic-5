import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product, ProductResponse } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe({
        next: (response) => {
          if (response && response.data) {
            if (Array.isArray(response.data)) {
                this.product = response.data[0];
            } else {
                this.product = response.data as unknown as Product;
            }
            if (this.product) {
               this.loadRelatedProducts(this.product.category, this.product._id);
            }
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching product', err);
          this.error = 'Failed to load product details';
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
      this.error = 'No product ID provided';
    }
  }
  relatedProducts: Product[] = [];
  quantity: number = 1;

  increaseQuantity() {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  loadRelatedProducts(category: string, currentProductId: string) {
    this.productService.getProducts().subscribe({
      next: (res) => {
        if (res && res.data) {
          const allProducts = Array.isArray(res.data) ? res.data : [];
          this.relatedProducts = allProducts
            .filter(p => p.category === category && p._id !== currentProductId)
            .slice(0, 4);
        }
      },
      error: (err) => console.error('Failed to load related products', err)
    });
  }
}
