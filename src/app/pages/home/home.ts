import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly slides = [
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1800&q=80',
    'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1800&q=80',
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1800&q=80',
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1800&q=80',
  ] as const;

  protected readonly activeSlide = signal(0);

  constructor() {
    afterNextRender(() => {
      this.route.fragment
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((fragment) => {
          if (!fragment) {
            return;
          }

          requestAnimationFrame(() => {
            if (fragment === 'intro') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              return;
            }

            document.getElementById(fragment)?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          });
        });

      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      if (reduceMotion || this.slides.length < 2) {
        return;
      }

      const timer = window.setInterval(() => {
        this.activeSlide.update((index) => (index + 1) % this.slides.length);
      }, 5500);

      this.destroyRef.onDestroy(() => window.clearInterval(timer));
    });
  }
}
