import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-admin-coming-soon',
  imports: [RouterLink],
  template: `
    <div class="admin-card soon">
      <p class="kicker">Скоро будет</p>
      <h1>{{ title() }}</h1>
      <p>Этот раздел ещё не подключили. Пока можно вести спецодежду.</p>
      <a class="admin-btn" routerLink="/admin/workwear">К спецодежде</a>
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-height: 0;
    }

    .soon {
      display: grid;
      justify-items: start;
      gap: 0.45rem;
      padding: 1.25rem 1.15rem 1.35rem;
      max-width: 32rem;
    }

    .kicker {
      font-family: var(--font-display);
      font-size: 0.72rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--signal);
    }

    h1 {
      margin-bottom: 0.15rem;
    }

    p {
      color: var(--steel);
      font-size: 0.92rem;
      margin-bottom: 0.55rem;
    }
  `,
})
export class AdminComingSoon {
  readonly title = toSignal(
    inject(ActivatedRoute).data.pipe(map((data) => String(data['title'] ?? 'Раздел'))),
    { initialValue: 'Раздел' },
  );
}
