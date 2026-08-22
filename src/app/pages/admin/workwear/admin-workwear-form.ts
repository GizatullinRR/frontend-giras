import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, concatMap, from, of, switchMap, tap } from 'rxjs';
import { apiErrorMessage } from '../../../core/api-error';
import { ToastService } from '../../../core/toast/toast.service';
import {
  WORKWEAR_CATEGORIES,
  WORKWEAR_GENDERS,
  WORKWEAR_SEASONS,
  WORKWEAR_SETS,
  WORKWEAR_SIZE_HEIGHTS,
  WORKWEAR_SIZE_ROWS,
} from '../../../core/workwear/workwear.labels';
import { WorkwearService } from '../../../core/workwear/workwear.service';
import {
  CreateWorkwearPayload,
  Workwear,
  WorkwearSize,
} from '../../../core/workwear/workwear.types';

@Component({
  selector: 'app-admin-workwear-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin-workwear-form.html',
  styleUrl: './admin-workwear-form.scss',
})
export class AdminWorkwearForm {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly workwearApi = inject(WorkwearService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly categories = WORKWEAR_CATEGORIES;
  readonly sets = WORKWEAR_SETS;
  readonly seasons = WORKWEAR_SEASONS;
  readonly genders = WORKWEAR_GENDERS;
  readonly sizeRows = WORKWEAR_SIZE_ROWS;
  readonly sizeHeights = WORKWEAR_SIZE_HEIGHTS;
  private readonly allSizeValues = WORKWEAR_SIZE_ROWS.flatMap((row) => row.sizes);

  readonly itemId = signal<string | null>(null);
  readonly isNew = computed(() => this.itemId() === null);
  readonly item = signal<Workwear | null>(null);
  readonly photoCount = computed(() => this.item()?.imageKeys.length ?? 0);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly uploading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
    description: [''],
    category: this.fb.nonNullable.control(this.categories[0].value, Validators.required),
    sizes: this.fb.nonNullable.control<WorkwearSize[]>([]),
    color: ['', Validators.required],
    season: this.fb.nonNullable.control(this.seasons[0].value, Validators.required),
    gender: this.fb.nonNullable.control(this.genders[0].value, Validators.required),
    set: this.fb.nonNullable.control(this.sets[0].value, Validators.required),
    material: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    isCertified: [false],
    article: [''],
  });

  readonly certified = toSignal(this.form.controls.isCertified.valueChanges, {
    initialValue: this.form.controls.isCertified.value,
  });

  constructor() {
    this.route.paramMap
      .pipe(
        takeUntilDestroyed(),
        switchMap((params) => {
          const id = params.get('id');
          this.itemId.set(id);
          this.error.set(null);
          this.saving.set(false);
          this.uploading.set(false);

          if (!id) {
            this.item.set(null);
            this.loading.set(false);
            this.resetBlank();
            return of(null);
          }

          this.loading.set(true);
          return this.workwearApi.findOne(id).pipe(
            catchError((err) => {
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

        this.applyItem(item);
        this.loading.set(false);
      });
  }

  toggleCertified() {
    const next = !this.form.controls.isCertified.getRawValue();
    this.form.controls.isCertified.setValue(next);
    this.form.controls.isCertified.markAsDirty();
  }

  hasSize(size: WorkwearSize) {
    return this.form.controls.sizes.getRawValue().includes(size);
  }

  toggleSize(size: WorkwearSize) {
    const current = this.form.controls.sizes.getRawValue();
    this.form.controls.sizes.setValue(
      current.includes(size)
        ? current.filter((value) => value !== size)
        : [...current, size],
    );
    this.form.controls.sizes.markAsDirty();
  }

  allSizesSelected() {
    const selected = new Set(this.form.controls.sizes.getRawValue());
    return this.allSizeValues.every((size) => selected.has(size));
  }

  toggleAllSizes() {
    this.form.controls.sizes.setValue(this.allSizesSelected() ? [] : [...this.allSizeValues]);
    this.form.controls.sizes.markAsDirty();
  }

  submit() {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    const id = this.itemId();
    if (id) {
      this.workwearApi.update(id, this.toPayload()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (item) => {
          this.applyItem(item);
          this.saving.set(false);
          this.toast.success('Сохранено');
        },
        error: (err) => {
          this.saving.set(false);
          this.toast.error(apiErrorMessage(err, 'Не удалось сохранить'));
        },
      });
      return;
    }

    this.workwearApi.create(this.toPayload()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (item) => {
        this.saving.set(false);
        this.toast.success('Позиция создана');
        void this.router.navigate(['/admin/workwear', item.id]);
      },
      error: (err) => {
        this.saving.set(false);
        this.toast.error(apiErrorMessage(err, 'Не удалось создать позицию'));
      },
    });
  }

  onFiles(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    const id = this.itemId();
    input.value = '';

    if (!id || files.length === 0 || this.uploading()) {
      return;
    }

    this.uploading.set(true);
    this.error.set(null);

    from(files)
      .pipe(
        concatMap((file) => this.workwearApi.addImage(id, file)),
        tap((item) => this.item.set(item)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        complete: () => {
          this.uploading.set(false);
          this.toast.success('Фото загружены');
        },
        error: (err) => {
          this.uploading.set(false);
          this.toast.error(apiErrorMessage(err, 'Не удалось загрузить фото'));
        },
      });
  }

  removeImage(key: string) {
    const id = this.itemId();
    if (!id || this.uploading()) {
      return;
    }

    this.uploading.set(true);
    this.workwearApi.removeImage(id, key).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (item) => {
        this.item.set(item);
        this.uploading.set(false);
        this.toast.success('Фото удалено');
      },
      error: (err) => {
        this.uploading.set(false);
        this.toast.error(apiErrorMessage(err, 'Не удалось удалить фото'));
      },
    });
  }

  private resetBlank() {
    this.form.reset({
      name: '',
      description: '',
      category: this.categories[0].value,
      sizes: [],
      color: '',
      season: this.seasons[0].value,
      gender: this.genders[0].value,
      set: this.sets[0].value,
      material: '',
      price: 0,
      isCertified: false,
      article: '',
    });
  }

  private applyItem(item: Workwear) {
    this.item.set(item);
    this.itemId.set(item.id);
    this.form.reset({
      name: item.name,
      description: item.description ?? '',
      category: item.category,
      sizes: item.sizes,
      color: item.color,
      season: item.season,
      gender: item.gender,
      set: item.set,
      material: item.material,
      price: Number(item.price),
      isCertified: item.isCertified,
      article: item.article ?? '',
    });
  }

  private toPayload(): CreateWorkwearPayload {
    const value = this.form.getRawValue();
    const article = value.article.trim();
    const description = value.description.trim();

    return {
      name: value.name.trim(),
      description: description || null,
      category: value.category,
      sizes: value.sizes,
      color: value.color.trim(),
      season: value.season,
      gender: value.gender,
      set: value.set,
      material: value.material.trim(),
      price: Number(value.price),
      isCertified: value.isCertified,
      article: article || null,
    };
  }
}
