import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderHistoryComponent } from './order-history/order-history';
import { BlobBackgroundComponent } from '../../shared/components/blob-background/blob-background';

@NgModule({
  declarations: [
    OrderHistoryComponent
  ],
  imports: [
    CommonModule,
    BlobBackgroundComponent
  ],
  exports: [
    OrderHistoryComponent
  ]
})
export class OrdersModule { }
