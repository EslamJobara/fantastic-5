import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutPageComponent } from './features/checkout/checkout-page/checkout-page';
import { CartPageComponent } from './features/cart/cart-page/cart-page';
import { ProductDetailsComponent } from './features/products/product-details/product-details';
import { ProductListComponent } from './features/products/product-list/product-list';
import { RegisterComponent } from './features/auth/register/register';
import { LoginComponent } from './features/auth/login/login';
import { LandingComponent } from './features/home/landing/landing';
import { OrderHistoryComponent } from './features/orders/order-history/order-history';

const routes: Routes = [ { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'cart', component: CartPageComponent },
  { path: 'checkout', component: CheckoutPageComponent },
  { path: 'orders', component: OrderHistoryComponent },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
