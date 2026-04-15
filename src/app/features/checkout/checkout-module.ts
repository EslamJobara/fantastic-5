import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CheckoutPageComponent } from './checkout-page/checkout-page';
import { BlobBackgroundComponent } from '../../shared/components/blob-background/blob-background';

@NgModule({
  declarations: [CheckoutPageComponent],
  imports: [CommonModule, RouterModule, BlobBackgroundComponent],
})
export class CheckoutModule {}
