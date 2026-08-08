import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, PLATFORM_ID, signal } from "@angular/core";
import { AuthUser, AuthUserResponse } from "./auth.types";
import { tap } from "rxjs";
import { isPlatformBrowser } from "@angular/common";

const API = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly platformId = inject(PLATFORM_ID);

    private readonly userSignal = signal<AuthUser | null>(null);

    readonly user = this.userSignal.asReadonly();
    readonly isLoggedIn = computed(() => this.userSignal() !== null);
    readonly isAdmin = computed(() => this.userSignal()?.role === 'ADMIN');

    register(email: string, password: string) {
        return this.http
            .post<AuthUserResponse>(
                `${API}/auth/register`,
                { email, password },
                { withCredentials: true }
            )
            .pipe(tap((res) => this.userSignal.set(res.user)))
    }

    login(email: string, password: string) {
        return this.http
            .post<AuthUserResponse>(
                `${API}/auth/login`,
                { email, password },
                { withCredentials: true },
            )
            .pipe(tap((res) => this.userSignal.set(res.user)));
    }

    logout() {
        return this.http
            .post(`${API}/auth/logout`, {}, { withCredentials: true })
            .pipe(tap(() => this.userSignal.set(null)));
    }

    refresh() {
        return this.http.post(
            `${API}/auth/refresh`,
            {},
            { withCredentials: true },
        );
    }

    restoreSession() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        this.http
            .get<AuthUser>(`${API}/auth/me`, { withCredentials: true })
            .subscribe({
                next: (user) => this.userSignal.set(user),
                error: () => this.userSignal.set(null),
            });
    }
}