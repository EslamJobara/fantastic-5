import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderHistoryComponent } from './order-history/order-history';
import { BlobBackgroundComponent } from '../../shared/components/blob-background/blob-background';

@NgModule({
  declarations: [
    OrderHistoryComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BlobBackgroundComponent
  ],
  exports: [
    OrderHistoryComponent
  ]
})
export class OrdersModule { }
