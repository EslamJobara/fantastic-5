import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() product: any;
  @Input() showActions: boolean = false;
  @Input() showAddToCart: boolean = true;
  @Input() showViewDetails: boolean = true;
  @Input() addToCartLabel: string = 'Add to Cart';
  @Input() viewDetailsLabel: string = 'View Details';
  @Input() isAddingToCart: boolean = false;
  @Input() isAddedToCart: boolean = false;
  
  @Output() addToCart = new EventEmitter<any>();
  @Output() viewDetails = new EventEmitter<any>();
  
  onAddToCart() {
    this.addToCart.emit(this.product);
  }
  
  onViewDetails() {
    this.viewDetails.emit(this.product);
  }
}
