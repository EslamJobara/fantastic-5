import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-landing',
  standalone: false,
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class LandingComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  readonly totalSlides = 3;

  // track: [clone_last, slide_0, slide_1, slide_2, clone_first]
  trackIndex = 1;
  isAnimating = false;
  transitionEnabled = true;

  private autoAdvanceTimer: any;

  ngOnInit() {
    this.startAutoAdvance();
  }

  ngOnDestroy() {
    this.stopAutoAdvance();
  }

  get trackTransform(): string {
    return `translateX(-${this.trackIndex * 100}%)`;
  }

  moveSlide(direction: number) {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.transitionEnabled = true;
    this.trackIndex += direction;
    // currentSlide maps trackIndex 1..3 → 0..2
    this.currentSlide = ((this.trackIndex - 1) % this.totalSlides + this.totalSlides) % this.totalSlides;
    // restart timer so manual nav doesn't cause double-jump
    this.stopAutoAdvance();
    this.startAutoAdvance();
  }

  goToSlide(index: number) {
    if (this.isAnimating || index === this.currentSlide) return;
    this.isAnimating = true;
    this.transitionEnabled = true;
    this.trackIndex = index + 1;
    this.currentSlide = index;
    this.stopAutoAdvance();
    this.startAutoAdvance();
  }

  // only fires once per slide move — filter by propertyName to avoid multi-fire
  onTransitionEnd(event: TransitionEvent) {
    if (event.propertyName !== 'transform') return;
    this.isAnimating = false;

    // landed on clone_first → jump silently to real first
    if (this.trackIndex === this.totalSlides + 1) {
      this.transitionEnabled = false;
      this.trackIndex = 1;
      this.currentSlide = 0;
      return;
    }

    // landed on clone_last → jump silently to real last
    if (this.trackIndex === 0) {
      this.transitionEnabled = false;
      this.trackIndex = this.totalSlides;
      this.currentSlide = this.totalSlides - 1;
    }
  }

  private startAutoAdvance() {
    this.autoAdvanceTimer = setInterval(() => this.moveSlide(1), 4000);
  }

  private stopAutoAdvance() {
    clearInterval(this.autoAdvanceTimer);
  }
}
