import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { CartService } from '../../../core/services/cart.service';
import { Product, ProductVariation, Category } from '@core/models';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  category: Category | null = null;
  isLoading = true;
  error: string | null = null;
  selectedImage: string = '';
  selectedVariation: ProductVariation | null = null;
  relatedProducts: Product[] = [];
  quantity: number = 1;
  isAddingToCart: boolean = false;
  addedToCart: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
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
              // Handle both array and single object
              const productData = Array.isArray(response.data) ? response.data[0] : response.data;
              
              // Check if product exists and is visible
              if (productData && productData.visible !== false && productData.isDeleted !== true) {
                this.product = productData;
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
                
                this.loadCategory(this.product.category);
                this.loadRelatedProducts(this.product.category, this.product._id);
              } else {
                // Product not found or not visible
                this.error = 'Product not found or unavailable';
              }
            } else {
              this.error = 'Product not found';
            }
            this.isLoading = false;
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
    this.router.navigate(['/products', productId]);
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

  loadCategory(categoryId: string) {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.category = response.data.find(cat => cat._id === categoryId) || null;
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Failed to load category', err)
    });
  }

  loadRelatedProducts(category: string, currentProductId: string) {
    this.productService.getProducts().subscribe({
      next: (res) => {
        if (res && res.data) {
          const allProducts = Array.isArray(res.data) ? res.data : [];
          // Get 4 random products excluding current product, only visible and not deleted
          this.relatedProducts = allProducts
            .filter(p => p._id !== currentProductId && 
                        p.visible !== false && 
                        p.isDeleted !== true)
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Failed to load related products', err)
    });
  }

  addToCart() {
    if (!this.product || this.isAddingToCart) {
      return;
    }

    // التحقق من اختيار variation إذا كان المنتج يحتوي على variations
    if (this.product.variations && this.product.variations.length > 0 && !this.selectedVariation) {
      console.log('Please select a color');
      return;
    }

    this.isAddingToCart = true;
    this.addedToCart = false;
    
    this.cartService.addToCart(
      this.product._id,
      this.quantity,
      this.selectedVariation?._id
    ).subscribe({
      next: () => {
        this.isAddingToCart = false;
        this.addedToCart = true;
        console.log('Product added to cart successfully!');
        this.cdr.detectChanges();
        
        // Reset success state after 2 seconds
        setTimeout(() => {
          this.addedToCart = false;
          this.cdr.detectChanges();
        }, 2000);
      },
      error: (error) => {
        this.isAddingToCart = false;
        this.addedToCart = false;
        console.error('Failed to add to cart', error);
        this.cdr.detectChanges();
      }
    });
  }
}
