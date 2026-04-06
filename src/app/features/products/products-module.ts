import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductListComponent } from './product-list/product-list';
import { ProductDetailsComponent } from './product-details/product-details';
import { BlobBackgroundComponent } from '../../shared/components/blob-background/blob-background';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { SearchBar } from '../../shared/components/search-bar/search-bar';

@NgModule({
  declarations: [ProductListComponent, ProductDetailsComponent],
  imports: [CommonModule, RouterModule, BlobBackgroundComponent, ProductCard, SearchBar],
})
export class ProductsModule {}
