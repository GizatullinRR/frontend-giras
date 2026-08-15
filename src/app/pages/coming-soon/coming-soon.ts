import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-coming-soon',
  imports: [RouterLink],
  template: `
    <section class="page-panel soon">
      <p class="eyebrow">Скоро в каталоге</p>
      <h1>{{ title() }}</h1>
      <p class="lead">
        Раздел ещё собираем. Пока открыта витрина спецодежды — остальные
        категории появятся в том же формате.
      </p>
      <a class="btn" routerLink="/workwear">Смотреть спецодежду</a>
    </section>
  `,
  styles: `
    :host {
      display: flex;
      flex: 1 1 auto;
      align-items: center;
    }

    .soon.page-panel {
      width: min(38rem, 100%);
      padding-top: clamp(2.5rem, 8vh, 5rem);
      padding-bottom: clamp(2.5rem, 8vh, 5rem);
    }

    .soon h1 {
      font-size: clamp(2.1rem, 5vw, 3.1rem);
      letter-spacing: 0.06em;
    }

    .eyebrow {
      font-family: var(--font-display);
      text-transform: uppercase;
      letter-spacing: 0.18em;
      font-size: 0.78rem;
      color: var(--signal);
      margin-bottom: 0.7rem;
    }

    .lead {
      margin: 0.9rem 0 1.5rem;
      max-width: 28rem;
      color: var(--ink-soft);
      line-height: 1.6;
    }

    .btn {
      display: inline-flex;
      text-decoration: none;
      padding: 0.8rem 1.15rem;
    }
  `,
})
export class ComingSoon {
  readonly title = toSignal(
    inject(ActivatedRoute).data.pipe(map((data) => String(data['title'] ?? 'Раздел'))),
    { initialValue: 'Раздел' },
  );
}
