import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'img[appImgFallback]',
  standalone: true
})
export class ImgFallbackDirective {
  @Input('appImgFallback') fallbackUrl: string = 'assets/images/placeholder-product.png';

  constructor(private el: ElementRef) {}

  @HostListener('error')
  onError() {
    const element: HTMLImageElement = this.el.nativeElement;
    // Prevent infinite loop if fallback also fails
    if (element.src !== this.fallbackUrl) {
      element.src = this.fallbackUrl || 'https://via.placeholder.com/400x400?text=Product+Image';
    }
  }
}
