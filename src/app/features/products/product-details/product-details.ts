import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetailsComponent implements OnInit {
  product: any = null;
  isLoading = true;
  error: string | null = null;
  selectedImage: string = '';
  relatedProducts: Product[] = [];
  quantity: number = 1;
  showToast = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.isLoading = true;
      const id = params.get('id');
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
                this.selectedImage = this.product.image;
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
    });
  }

  goToProduct(productId: string) {
    this.router.navigate(['/products', productId]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

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

  changeImage(imageUrl: string) {
    this.selectedImage = imageUrl;
  }

  loadRelatedProducts(category: string, currentProductId: string) {
    this.productService.getProducts().pipe(
      map(res => {
        const allProducts = Array.isArray(res.data) ? res.data : [];
        return allProducts
          .filter(p => p.category === category && p._id !== currentProductId)
          .slice(0, 4);
      })
    ).subscribe({
      next: (filtered) => this.relatedProducts = filtered,
      error: (err) => console.error('Failed to load related products', err)
    });
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product._id, this.quantity).subscribe({
        next: () => {
          this.showToast = true;
          setTimeout(() => this.showToast = false, 3000);
        },
        error: (err) => console.error('Failed to add to cart', err)
      });
    }
  }
}
