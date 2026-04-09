import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartService, Cart } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-checkout-page',
  standalone: false,
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css',
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
  cart: Cart | null = null;
  currentUser: any = null;
  isProcessing = false;
  orderSuccess = false;
  
  // Checkout Form Model
  shippingInfo = {
    fullName: '',
    email: '',
    address: '',
    city: '',
    phone: '',
    paymentMethod: 'card'
  };

  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // جلب بيانات السلة
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cart => {
        this.cart = cart;
        this.cdr.detectChanges();
        if (cart.items.length === 0 && !this.orderSuccess) {
          // لو السلة فضيت فجأة نرجعه للكارت
          // this.router.navigate(['/cart']);
        }
      });

    // جلب بيانات المستخدم الحالي إذا كان مسجلاً
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        if (user) {
          this.shippingInfo.fullName = user.fullName || user.userName || '';
          this.shippingInfo.email = user.email || '';
          this.shippingInfo.phone = user.phone || '';
          this.cdr.detectChanges();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * إتمام الطلب
   */
  placeOrder(): void {
    if (!this.shippingInfo.fullName || !this.shippingInfo.address || !this.shippingInfo.phone) {
      alert('Please fill in all shipping details');
      return;
    }

    this.isProcessing = true;
    this.cdr.detectChanges();
    
    // محاكاة إرسال الطلب (بما أن الباك إند اوردر لسه مش جاهز بالكامل)
    setTimeout(() => {
      this.isProcessing = false;
      this.orderSuccess = true;
      this.cdr.detectChanges();
      
      // مسح السلة بعد النجاح
      this.cartService.clearCart().subscribe();
      
      // التوجيه لصفحة النجاح أو الرئيسية بعد 3 ثواني
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 5000);
    }, 2000);
  }

  get canPlaceOrder(): boolean {
    return (this.cart?.items.length ?? 0) > 0 && !this.isProcessing;
  }
}
