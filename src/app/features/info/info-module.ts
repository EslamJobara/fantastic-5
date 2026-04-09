import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoPage } from './info-page/info-page';
import { BlobBackgroundComponent } from '../../shared/components/blob-background/blob-background';
@NgModule({
  declarations: [InfoPage],
  imports: [CommonModule,BlobBackgroundComponent],
  
})
export class InfoModule {}
