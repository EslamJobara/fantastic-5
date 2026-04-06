import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing';
import { BlobBackgroundComponent } from '../../shared/components/blob-background/blob-background';

@NgModule({
  declarations: [LandingComponent],
  imports: [CommonModule, BlobBackgroundComponent],
})
export class HomeModule {}
