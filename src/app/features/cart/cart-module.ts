import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartPageComponent } from './cart-page/cart-page';
import { BlobBackgroundComponent } from '../../shared/components/blob-background/blob-background';

@NgModule({
  declarations: [CartPageComponent],
  imports: [CommonModule, BlobBackgroundComponent],
})
export class CartModule {}
