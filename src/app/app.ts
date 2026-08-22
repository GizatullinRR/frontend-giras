import { Component, DestroyRef, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import { AuthService } from './core/auth/auth.service';
import { SearchHit, SearchService, searchHitPath } from './core/search/search.service';
import { ToastHost } from './core/toast/toast-host';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastHost],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly searchApi = inject(SearchService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly query = signal('');
  protected readonly results = signal<SearchHit[]>([]);
  protected readonly searching = signal(false);
  protected readonly open = signal(false);
  protected readonly activeIndex = signal(-1);

  private readonly query$ = new Subject<string>();

  constructor() {
    this.query$
      .pipe(
        debounceTime(220),
        distinctUntilChanged(),
        switchMap((q) => {
          const value = q.trim();
          if (value.length < 2) {
            this.searching.set(false);
            this.results.set([]);
            this.open.set(false);
            this.activeIndex.set(-1);
            return of({ items: [] as SearchHit[] });
          }

          this.searching.set(true);
          return this.searchApi.find(value).pipe(
            catchError(() => of({ items: [] as SearchHit[] })),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((res) => {
        this.searching.set(false);
        this.results.set(res.items);
        this.open.set(this.query().trim().length >= 2);
        this.activeIndex.set(res.items.length ? 0 : -1);
      });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    if (!target?.closest('.header-search')) {
      this.open.set(false);
    }
  }

  onQueryInput(value: string) {
    this.query.set(value);
    this.query$.next(value);
  }

  clearSearch() {
    this.query.set('');
    this.results.set([]);
    this.open.set(false);
    this.activeIndex.set(-1);
    this.query$.next('');
  }

  search(event: Event) {
    event.preventDefault();
    const items = this.results();
    const index = this.activeIndex();
    if (index >= 0 && items[index]) {
      this.openHit(items[index]);
      return;
    }
    if (items[0]) {
      this.openHit(items[0]);
    }
  }

  onSearchKeydown(event: KeyboardEvent) {
    const items = this.results();
    if (!this.open() || items.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex.update((i) => (i + 1) % items.length);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex.update((i) => (i <= 0 ? items.length - 1 : i - 1));
      return;
    }

    if (event.key === 'Escape') {
      this.open.set(false);
    }
  }

  openHit(hit: SearchHit) {
    const path = searchHitPath(hit);
    if (!path) {
      return;
    }

    this.open.set(false);
    this.query.set(hit.title);
    void this.router.navigateByUrl(path);
  }

  goHome(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const path = this.router.url.split('#')[0].split('?')[0];

    if (path === '/' || path === '') {
      if (window.location.hash) {
        history.replaceState(
          null,
          '',
          `${window.location.pathname}${window.location.search}`,
        );
      }
      this.scrollToIntro();
      return;
    }

    void this.router.navigateByUrl('/').then(() => {
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    });
  }

  goToCatalog(event: Event) {
    event.preventDefault();
    const path = this.router.url.split('#')[0].split('?')[0];

    if (path === '/' || path === '') {
      void this.router.navigate(['/'], {
        fragment: 'catalog',
        queryParamsHandling: 'preserve',
        replaceUrl: true,
      });
      this.scrollToCatalog();
      return;
    }

    void this.router.navigate(['/'], { fragment: 'catalog' });
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => void this.router.navigateByUrl('/'),
      error: () => void this.router.navigateByUrl('/'),
    });
  }

  private scrollToIntro() {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  private scrollToCatalog() {
    requestAnimationFrame(() => {
      document.getElementById('catalog')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }
}
