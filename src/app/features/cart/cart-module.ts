import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartPageComponent } from './cart-page/cart-page';
import { BlobBackgroundComponent } from '../../shared/components/blob-background/blob-background';

@NgModule({
  declarations: [CartPageComponent],
  imports: [CommonModule, FormsModule, RouterModule, BlobBackgroundComponent],
})
export class CartModule {}
