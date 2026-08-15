import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
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

  protected readonly query = signal('');

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

  clearSearch() {
    this.query.set('');
    const path = this.router.url.split('#')[0].split('?')[0] || '/';
    void this.router.navigate([path], {
      queryParams: {},
      queryParamsHandling: '',
      replaceUrl: true,
    });
  }

  search(event: Event) {
    event.preventDefault();
    const q = this.query().trim();
    if (!q) {
      return;
    }

    // Пока заглушка: только кладём q в URL. Позже — дропдаун и страница товара.
    void this.router.navigate([], {
      queryParams: { q },
      queryParamsHandling: '',
      replaceUrl: true,
    });
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
