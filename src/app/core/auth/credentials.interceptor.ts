import { HttpInterceptorFn } from '@angular/common/http';
import { API_URL } from '../api';

/** Для запросов к API всегда шлём cookies (session_id). */
export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(API_URL)) {
    return next(req);
  }

  return next(req.clone({ withCredentials: true }));
};
