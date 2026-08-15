import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { apiErrorMessage } from '../../core/api-error';
import {
  categoryLabel,
  formatPrice,
  genderLabel,
  groupedSizes,
  seasonLabel,
  setLabel,
} from '../../core/workwear/workwear.labels';
import { WorkwearService } from '../../core/workwear/workwear.service';
import { Workwear } from '../../core/workwear/workwear.types';

@Component({
  selector: 'app-workwear-product',
  imports: [RouterLink],
  templateUrl: './workwear-product.html',
  styleUrl: './workwear-product.scss',
})
export class WorkwearProduct {
  private readonly workwearApi = inject(WorkwearService);
  private readonly route = inject(ActivatedRoute);

  readonly item = signal<Workwear | null>(null);
  readonly catalog = signal<Workwear[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly active = signal(0);

  readonly categoryLabel = categoryLabel;
  readonly seasonLabel = seasonLabel;
  readonly genderLabel = genderLabel;
  readonly setLabel = setLabel;
  readonly groupedSizes = groupedSizes;
  readonly formatPrice = formatPrice;

  readonly related = computed(() => {
    const product = this.item();
    if (!product) {
      return [];
    }

    return this.catalog()
      .filter((item) => item.id !== product.id && item.category === product.category)
      .slice(0, 4);
  });

  constructor() {
    this.workwearApi.findAll().pipe(takeUntilDestroyed()).subscribe({
      next: (items) => this.catalog.set(items),
    });

    this.route.paramMap
      .pipe(
        takeUntilDestroyed(),
        switchMap((params) => {
          const id = params.get('id');
          if (!id) {
            this.item.set(null);
            this.loading.set(false);
            this.error.set('Позиция не найдена');
            return of(null);
          }

          this.loading.set(true);
          this.error.set(null);
          this.active.set(0);
          window.scrollTo({ top: 0 });

          return this.workwearApi.findOne(id).pipe(
            catchError((err) => {
              this.item.set(null);
              this.loading.set(false);
              this.error.set(apiErrorMessage(err, 'Позиция не найдена'));
              return of(null);
            }),
          );
        }),
      )
      .subscribe((item) => {
        if (!item) {
          return;
        }

        this.item.set(item);
        this.loading.set(false);
      });
  }

  step(delta: number) {
    const total = this.item()?.imageUrls.length ?? 0;
    if (total < 2) {
      return;
    }

    this.active.update((index) => (index + delta + total) % total);
  }
}
