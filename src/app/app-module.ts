import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { ProductCard } from './shared/components/product-card/product-card';
import { Navbar } from './layout/navbar/navbar';
import { Footer } from './layout/footer/footer';
import { AuthModule } from './features/auth/auth-module';
import { CartModule } from './features/cart/cart-module';
import { CheckoutModule } from './features/checkout/checkout-module';
import { HomeModule } from './features/home/home-module';
import { ProductsModule } from './features/products/products-module';

@NgModule({
  declarations: [App, ProductCard, Navbar, Footer],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    CartModule,
    CheckoutModule,
    HomeModule,
    ProductsModule
  ],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
