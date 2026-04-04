import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-landing',
  standalone: false,
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class LandingComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  private autoAdvanceInterval: any;

  ngOnInit() {
    this.startAutoAdvance();
  }

  ngOnDestroy() {
    this.stopAutoAdvance();
  }

  moveSlide(direction: number) {
    const totalSlides = 3;
    this.currentSlide = (this.currentSlide + direction + totalSlides) % totalSlides;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  startAutoAdvance() {
    this.autoAdvanceInterval = setInterval(() => {
      this.moveSlide(1);
    }, 8000);
  }

  stopAutoAdvance() {
    if (this.autoAdvanceInterval) {
      clearInterval(this.autoAdvanceInterval);
    }
  }

  getTransform(): string {
    return `translateX(-${this.currentSlide * 100}%)`;
  }
}
