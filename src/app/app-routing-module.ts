import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutPageComponent } from './features/checkout/checkout-page/checkout-page';
import { CartPageComponent } from './features/cart/cart-page/cart-page';
import { ProductDetailsComponent } from './features/products/product-details/product-details';
import { ProductListComponent } from './features/products/product-list/product-list';
import { AuthPageComponent } from './features/auth/auth-page/auth-page';
import { LandingComponent } from './features/home/landing/landing';
import { OrderHistoryComponent } from './features/orders/order-history/order-history';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { InfoPage } from './features/info/info-page/info-page'; 

const routes: Routes = [ 
  { path: '', component: LandingComponent },
  { path: 'auth', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: AuthPageComponent, canActivate: [guestGuard] },
  { path: 'auth/register', component: AuthPageComponent, canActivate: [guestGuard] },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'cart', component: CartPageComponent, canActivate: [authGuard] },
  { path: 'checkout', component: CheckoutPageComponent, canActivate: [authGuard] },
  { path: 'orders', component: OrderHistoryComponent, canActivate: [authGuard] },
  { path: 'info', component: InfoPage },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
