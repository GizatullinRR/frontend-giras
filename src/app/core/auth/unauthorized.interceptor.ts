import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { API_URL } from '../api';
import { AuthService } from './auth.service';

const AUTH_BOOTSTRAP = ['/auth/me', '/auth/login', '/auth/register'];

/** Сбрасывает локальную сессию, если API ответил 401 (истёк cookie / нет доступа). */
export const unauthorizedInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(API_URL)) {
    return next(req);
  }

  const path = req.url.slice(API_URL.length);
  if (AUTH_BOOTSTRAP.some((suffix) => path.startsWith(suffix))) {
    return next(req);
  }

  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        auth.clearSession();
      }
      return throwError(() => err);
    }),
  );
};
