import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const TOAST_DURATION_MS = 3800;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private seq = 0;
  readonly toasts = signal<Toast[]>([]);

  success(message: string) {
    this.push(message, 'success');
  }

  error(message: string) {
    this.push(message, 'error');
  }

  dismiss(id: number) {
    this.toasts.update((list) => list.filter((toast) => toast.id !== id));
  }

  private push(message: string, type: ToastType) {
    const id = ++this.seq;
    this.toasts.update((list) => [...list, { id, message, type }]);
    if (typeof window !== 'undefined') {
      window.setTimeout(() => this.dismiss(id), TOAST_DURATION_MS);
    }
  }
}
