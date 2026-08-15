import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast-host',
  template: `
    <div class="toast-host" aria-live="polite">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="toast.type" role="status">
          <span>{{ toast.message }}</span>
          <button type="button" aria-label="Закрыть" (click)="toastService.dismiss(toast.id)">
            ×
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .toast-host {
      position: fixed;
      right: 1rem;
      bottom: 1rem;
      z-index: 80;
      display: grid;
      gap: 0.55rem;
      width: min(22rem, calc(100vw - 2rem));
      pointer-events: none;
    }

    .toast {
      display: flex;
      align-items: flex-start;
      gap: 0.65rem;
      padding: 0.8rem 0.85rem;
      border-radius: 10px;
      border: 1px solid var(--line);
      box-shadow: 0 14px 32px color-mix(in srgb, var(--ink) 12%, transparent);
      font-size: 0.9rem;
      line-height: 1.35;
      pointer-events: auto;
      animation: toast-in 0.28s var(--ease-out) both;
    }

    .toast.success {
      background: color-mix(in srgb, #e7f3ea 88%, white);
      color: #1f6b3a;
      border-color: color-mix(in srgb, #1f6b3a 22%, var(--line));
    }

    .toast.error {
      background: color-mix(in srgb, #fdecea 88%, white);
      color: #8b2e1f;
      border-color: color-mix(in srgb, #8b2e1f 22%, var(--line));
    }

    .toast span {
      flex: 1;
      min-width: 0;
    }

    .toast button {
      appearance: none;
      border: 0;
      background: transparent;
      color: inherit;
      cursor: pointer;
      padding: 0;
      margin: -0.15rem 0 0;
      font-size: 1.15rem;
      line-height: 1;
      opacity: 0.55;
    }

    .toast button:hover {
      opacity: 1;
    }

    @keyframes toast-in {
      from {
        opacity: 0;
        transform: translateY(0.6rem);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
})
export class ToastHost {
  readonly toastService = inject(ToastService);
}
