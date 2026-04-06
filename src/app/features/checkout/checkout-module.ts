import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutPageComponent } from './checkout-page/checkout-page';
import { BlobBackgroundComponent } from '../../shared/components/blob-background/blob-background';

@NgModule({
  declarations: [CheckoutPageComponent],
  imports: [CommonModule, BlobBackgroundComponent],
})
export class CheckoutModule {}
