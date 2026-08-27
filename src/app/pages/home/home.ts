import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CATALOG_SECTIONS } from '../../core/catalog/catalog-sections';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly sections = CATALOG_SECTIONS;

  protected readonly slides = [
    '/images/home/hero-1.jpg',
    '/images/home/hero-2.jpg',
    '/images/home/hero-3.jpg',
    '/images/home/hero-4.jpg',
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
