import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navbar } from './layout/navbar/navbar';
import { Footer } from './layout/footer/footer';
import { AuthModule } from './features/auth/auth-module';
import { CartModule } from './features/cart/cart-module';
import { CheckoutModule } from './features/checkout/checkout-module';
import { HomeModule } from './features/home/home-module';
import { ProductsModule } from './features/products/products-module';
import { OrdersModule } from './features/orders/orders-module';
import { SearchBar } from './shared/components/search-bar/search-bar';

@NgModule({
  declarations: [App, Navbar, Footer],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    AuthModule,
    CartModule,
    CheckoutModule,
    HomeModule,
    ProductsModule,
    OrdersModule,
    SearchBar
  ],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
