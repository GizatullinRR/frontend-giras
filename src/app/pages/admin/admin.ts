import { isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, effect, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CATALOG_SECTIONS } from '../../core/catalog/catalog-sections';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <section class="page-panel admin">
      <nav class="admin-nav" aria-label="Разделы каталога">
        @for (section of sections; track section.slug) {
          <a
            [routerLink]="['/admin', section.slug]"
            routerLinkActive="is-active"
          >
            {{ section.title }}
          </a>
        }
      </nav>
      <router-outlet />
    </section>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      flex: 1 1 0;
      min-height: 0;
      overflow: hidden;
    }

    .admin-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 0.3rem;
      flex: 0 0 auto;
      margin-bottom: 0.85rem;
      padding: 0.18rem;
      width: fit-content;
      max-width: 100%;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: color-mix(in srgb, white 70%, var(--paper));
    }

    .admin-nav a {
      font-family: var(--font-display);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      text-decoration: none;
      color: var(--steel);
      font-size: 0.72rem;
      padding: 0.38rem 0.75rem;
      border-radius: 999px;
      transition: background 0.15s ease, color 0.15s ease;
    }

    .admin-nav a:hover {
      color: var(--ink);
    }

    .admin-nav a.is-active {
      color: var(--paper);
      background: var(--olive);
    }
  `,
})
export class Admin {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly sections = CATALOG_SECTIONS;

  constructor() {
    const platformId = inject(PLATFORM_ID);
    if (isPlatformBrowser(platformId)) {
      const root = document.documentElement;
      const previous = root.style.overflow;
      root.style.overflow = 'hidden';
      inject(DestroyRef).onDestroy(() => {
        root.style.overflow = previous;
      });
    }

    effect(() => {
      if (!this.auth.isHydrated() || this.auth.isAdmin()) {
        return;
      }

      void this.router.navigateByUrl('/');
    });
  }
}
