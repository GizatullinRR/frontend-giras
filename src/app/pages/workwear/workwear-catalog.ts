import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { apiErrorMessage } from '../../core/api-error';
import {
  categoryLabel,
  formatPrice,
  genderLabel,
  seasonLabel,
  WORKWEAR_CATEGORIES,
  WORKWEAR_GENDERS,
  WORKWEAR_SEASONS,
  WORKWEAR_SIZE_HEIGHTS,
  WORKWEAR_SIZE_ROWS,
  WORKWEAR_SETS,
} from '../../core/workwear/workwear.labels';
import { WorkwearService } from '../../core/workwear/workwear.service';
import {
  Workwear,
  WorkwearCategory,
  WorkwearGender,
  WorkwearItemSet,
  WorkwearSeason,
  WorkwearSize,
} from '../../core/workwear/workwear.types';

@Component({
  selector: 'app-workwear-catalog',
  imports: [RouterLink],
  templateUrl: './workwear-catalog.html',
  styleUrl: './workwear-catalog.scss',
})
export class WorkwearCatalog {
  private readonly workwearApi = inject(WorkwearService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly categories = WORKWEAR_CATEGORIES;
  readonly seasons = WORKWEAR_SEASONS;
  readonly genders = WORKWEAR_GENDERS;
  readonly sets = WORKWEAR_SETS;
  readonly sizeRows = WORKWEAR_SIZE_ROWS;
  readonly sizeHeights = WORKWEAR_SIZE_HEIGHTS;
  readonly formatPrice = formatPrice;
  readonly categoryLabel = categoryLabel;
  readonly seasonLabel = seasonLabel;
  readonly genderLabel = genderLabel;

  readonly items = signal<Workwear[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly category = signal<WorkwearCategory | ''>('');
  readonly season = signal<WorkwearSeason | ''>('');
  readonly gender = signal<WorkwearGender | ''>('');
  readonly set = signal<WorkwearItemSet | ''>('');
  readonly size = signal<WorkwearSize | ''>('');
  readonly certified = signal(false);

  readonly filtered = computed(() => {
    const category = this.category();
    const season = this.season();
    const gender = this.gender();
    const set = this.set();
    const size = this.size();
    const certified = this.certified();

    return this.items().filter((item) => {
      if (category && item.category !== category) {
        return false;
      }
      if (season && item.season !== season) {
        return false;
      }
      if (gender && item.gender !== gender) {
        return false;
      }
      if (set && item.set !== set) {
        return false;
      }
      if (size && !item.sizes.includes(size)) {
        return false;
      }
      if (certified && !item.isCertified) {
        return false;
      }
      return true;
    });
  });

  readonly hasFilters = computed(
    () =>
      Boolean(this.category() || this.season() || this.gender() || this.set() || this.size()) ||
      this.certified(),
  );

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.category.set((params.get('category') as WorkwearCategory) || '');
      this.season.set((params.get('season') as WorkwearSeason) || '');
      this.gender.set((params.get('gender') as WorkwearGender) || '');
      this.set.set((params.get('set') as WorkwearItemSet) || '');
      this.size.set((params.get('size') as WorkwearSize) || '');
      this.certified.set(params.get('cert') === '1');
    });

    this.workwearApi.findAll().pipe(takeUntilDestroyed()).subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(apiErrorMessage(err, 'Не удалось загрузить каталог'));
      },
    });
  }

  patchQuery(key: string, value: string | null) {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [key]: value },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  toggle(key: string, current: string, next: string) {
    this.patchQuery(key, current === next ? null : next);
  }

  toggleCertified() {
    this.patchQuery('cert', this.certified() ? null : '1');
  }

  clearFilters() {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        category: null,
        season: null,
        gender: null,
        set: null,
        size: null,
        cert: null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
