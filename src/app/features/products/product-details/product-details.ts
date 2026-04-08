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
  relatedProducts = [
    {
      name: 'Vision Tab Ultra',
      badge: 'Tablets',
      price: '$1,299.00',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaw2hi9jU2iayYvD3FIxvmCKsfnVZgVq9WndRcdHPPUzNNPWScN3sc5D2gYnnwChltE6heoWYrVUdoHQyeW8gLeP6fEEczihU0bZFDwzFjwgK9gKxTR1GUWzfGIAcxkDvaSyINVq1ZQWGV6zztEnA3IvkWrIkTs-qFzDY1EUGykureKlJEVeVTCiWUgj0W1GYKRHDkF7oSuAR66IH0ixNbLzXacq2bM_7CHh8jKg6Il_P9P_nB6DamB7aQmC5GGSafIpZwP_fOJyaK'
    },
    {
      name: 'Sonic Pro ANC',
      badge: 'Audio',
      price: '$349.00',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcCB26QtdZ864dxejP5LLOmm_aTMaU6tgSts-lzYA2RYepbYEKWaQ0JzjEo3xgxEZvbFJ7N9DqBU6B6_-9hJRlTa91tGrat4V8b8hTwRMPFJ-pdsO-B8WO2LczvBc_FULk2TFDf4Lg3txPA3wEwb-u-L-dy2bqSB8k30jpj5oEI5zpTDvdc7QG8SQ_JYEEyRmrtMUlHchcWqazllvssEGRGX0RCfwxWOwDMVRhS15VYJPdaRlYNyoU2BhDB5uV3xEm5M4x3k_VZtNh'
    },
    {
      name: 'Architect Watch S2',
      badge: 'Wearables',
      price: '$499.00',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjVJMZBrOqp-jDf9-105Zm2fRNQ5jXz8oluII4bBC2kK2GqZnUTe3aoBche0z7NfHsXBuT2ticUfI_wHzgZmXFm2fJyiEmNJX6S9tkrS2wnodl0jVLvHHAxLjn7ShDhanpEGtj6zNF_9lv0zrnjWpYJytfjzdyogeSmg6TLJ3dpKpm9o4I6X_0kGrQoIdp2y54T2vJTXZf6WjlhqtxwvTu3b6Bl2tvmAMe9SFlXBWxa-b5qHKSfx8D3da74sGd11CBSQNEI7EimITi'
    },
    {
      name: 'Panoramic View 5K',
      badge: 'Monitors',
      price: '$1,899.00',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2fTInOZ0ckRcXQ4Oihp2qpPlLS-FJFKp_QuwaSB9HCy_Zroev-WCZaE9kjKoYCXnEyGQzLPZa439GH9zSqn7QbSUZ3o6CeRjfnTMlBWtkXbslqeBhqUFUplFq_RDIoE27ZNB-Gg7rhPjyQCrHUiSjBuWc4dVTlQHMwy9VUjRcvXrkEOYmKBQNApaH1kC2fzzLYO7PwST9yJxD1Hxt76Zbdli83rOVihJUK-T_MmvF5PZj1LRYtQt6nT9zu8iiNIGh3VtFGnnKg7jX'
    }
  ];
}
