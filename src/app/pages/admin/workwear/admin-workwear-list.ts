import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { apiErrorMessage } from '../../../core/api-error';
import { ToastService } from '../../../core/toast/toast.service';
import {
  categoryLabel,
  formatPrice,
  genderLabel,
  seasonLabel,
} from '../../../core/workwear/workwear.labels';
import { WorkwearService } from '../../../core/workwear/workwear.service';
import { Workwear } from '../../../core/workwear/workwear.types';

@Component({
  selector: 'app-admin-workwear-list',
  imports: [RouterLink],
  templateUrl: './admin-workwear-list.html',
  styleUrl: './admin-workwear-list.scss',
})
export class AdminWorkwearList implements OnInit {
  private readonly workwearApi = inject(WorkwearService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly items = signal<Workwear[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly busyId = signal<string | null>(null);
  readonly reordering = signal(false);

  readonly categoryLabel = categoryLabel;
  readonly seasonLabel = seasonLabel;
  readonly genderLabel = genderLabel;
  readonly formatPrice = formatPrice;

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);

    this.workwearApi.findAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(apiErrorMessage(err, 'Не удалось загрузить спецодежду'));
      },
    });
  }

  move(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    const current = this.items();
    if (this.reordering() || nextIndex < 0 || nextIndex >= current.length) {
      return;
    }

    const reordered = [...current];
    const [item] = reordered.splice(index, 1);
    reordered.splice(nextIndex, 0, item);
    this.items.set(reordered);
    this.reordering.set(true);

    this.workwearApi.reorder(reordered.map((row) => row.id)).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (items) => {
        this.items.set(items);
        this.reordering.set(false);
      },
      error: (err) => {
        this.reordering.set(false);
        this.toast.error(apiErrorMessage(err, 'Не удалось сохранить порядок'));
        this.load();
      },
    });
  }

  copy(item: Workwear) {
    if (this.busyId()) {
      return;
    }

    this.busyId.set(item.id);
    this.workwearApi.copy(item.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (copy) => {
        this.items.update((list) => [...list, copy]);
        this.busyId.set(null);
        this.toast.success('Копия создана');
      },
      error: (err) => {
        this.busyId.set(null);
        this.toast.error(apiErrorMessage(err, 'Не удалось скопировать позицию'));
      },
    });
  }

  remove(item: Workwear) {
    if (this.busyId()) {
      return;
    }

    if (!confirm(`Удалить «${item.name}»? Фото тоже удалятся.`)) {
      return;
    }

    this.busyId.set(item.id);
    this.workwearApi.remove(item.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.items.update((list) => list.filter((row) => row.id !== item.id));
        this.busyId.set(null);
        this.toast.success('Позиция удалена');
      },
      error: (err) => {
        this.busyId.set(null);
        this.toast.error(apiErrorMessage(err, 'Не удалось удалить позицию'));
      },
    });
  }
}
