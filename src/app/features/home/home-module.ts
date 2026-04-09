import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing';
import { BlobBackgroundComponent } from '../../shared/components/blob-background/blob-background';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { ImgFallbackDirective } from '../../shared/directives/img-fallback.directive';

@NgModule({
  declarations: [LandingComponent],
  imports: [CommonModule, BlobBackgroundComponent, ProductCard, ImgFallbackDirective],
})
export class HomeModule {}
