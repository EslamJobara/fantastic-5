import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product, ProductResponse, ProductVariation } from '@core/models';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  isLoading = true;
  error: string | null = null;
  selectedImage: string = '';
  selectedVariation: ProductVariation | null = null;
  relatedProducts: Product[] = [];
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.isLoading = true;
      this.cdr.markForCheck();
      
      const id = params.get('id');
      if (id) {
        this.productService.getProductById(id).subscribe({
          next: (response) => {
            console.log('Product response:', response);
            if (response && response.data) {
              // Backend returns array, get first item
              const productData = Array.isArray(response.data) ? response.data[0] : response.data;
              
              if (productData) {
                this.product = productData as Product;
                console.log('Product loaded:', this.product);
                
                // Select default variation
                if (this.product.variations && this.product.variations.length > 0) {
                  this.selectedVariation = this.product.variations.find(v => v.isDefault) || this.product.variations[0];
                  this.selectedImage = this.selectedVariation.defaultImage;
                  console.log('Selected variation:', this.selectedVariation);
                  console.log('Selected image:', this.selectedImage);
                } else {
                  // Fallback if no variations
                  this.selectedImage = this.product.defaultImg || '';
                }
                
                this.loadRelatedProducts(this.product.category, this.product._id);
              }
            }
            this.isLoading = false;
            this.cdr.markForCheck();
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error fetching product', err);
            this.error = 'Failed to load product details';
            this.isLoading = false;
            this.cdr.markForCheck();
            this.cdr.detectChanges();
          }
        });
      } else {
        this.isLoading = false;
        this.error = 'No product ID provided';
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  goToProduct(productId: string) {
    this.router.navigate(['/product', productId]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  increaseQuantity() {
    const maxStock = this.selectedVariation?.stock || this.product?.stock || 0;
    if (this.quantity < maxStock) {
      this.quantity++;
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }
  }

  changeImage(imageUrl: string) {
    this.selectedImage = imageUrl;
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  selectVariation(variation: ProductVariation) {
    this.selectedVariation = variation;
    this.selectedImage = variation.defaultImage;
    this.quantity = 1; // Reset quantity when changing variation
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  getCurrentStock(): number {
    return this.selectedVariation?.stock || this.product?.stock || 0;
  }

  getCurrentImages(): string[] {
    if (this.selectedVariation) {
      const images = [this.selectedVariation.defaultImage, ...this.selectedVariation.variationImgs];
      return images.filter(img => img); // Remove empty strings
    }
    return this.product?.images || [];
  }

  loadRelatedProducts(category: string, currentProductId: string) {
    this.productService.getProducts().subscribe({
      next: (res) => {
        if (res && res.data) {
          const allProducts = Array.isArray(res.data) ? res.data : [];
          this.relatedProducts = allProducts
            .filter(p => p.category === category && p._id !== currentProductId)
            .slice(0, 4);
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Failed to load related products', err)
    });
  }
}
