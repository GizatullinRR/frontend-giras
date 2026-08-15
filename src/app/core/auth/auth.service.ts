import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  computed,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { tap } from 'rxjs';
import { API_URL } from '../api';
import { AuthUser, AuthUserResponse } from './auth.types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly userSignal = signal<AuthUser | null>(null);
  private readonly hydratedSignal = signal(false);

  readonly user = this.userSignal.asReadonly();
  readonly isHydrated = this.hydratedSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.userSignal() !== null);
  readonly isAdmin = computed(() => this.userSignal()?.role === 'ADMIN');

  constructor() {
    this.restoreSession();
  }

  register(email: string, password: string) {
    return this.http
      .post<AuthUserResponse>(`${API_URL}/auth/register`, { email, password })
      .pipe(tap((res) => this.userSignal.set(res.user)));
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthUserResponse>(`${API_URL}/auth/login`, { email, password })
      .pipe(tap((res) => this.userSignal.set(res.user)));
  }

  logout() {
    return this.http
      .post(`${API_URL}/auth/logout`, {})
      .pipe(tap(() => this.clearSession()));
  }

  clearSession() {
    this.userSignal.set(null);
  }

  restoreSession() {
    if (!isPlatformBrowser(this.platformId)) {
      this.hydratedSignal.set(true);
      return;
    }

    this.http.get<AuthUser>(`${API_URL}/auth/me`).subscribe({
      next: (user) => {
        this.userSignal.set(user);
        this.hydratedSignal.set(true);
      },
      error: () => {
        this.clearSession();
        this.hydratedSignal.set(true);
      },
    });
  }
}
