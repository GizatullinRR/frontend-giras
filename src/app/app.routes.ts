import { Routes } from '@angular/router';
import { adminGuard } from './core/auth/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register').then((m) => m.Register),
  },
  {
    path: 'workwear',
    loadComponent: () =>
      import('./pages/workwear/workwear-catalog').then((m) => m.WorkwearCatalog),
  },
  {
    path: 'workwear/:id',
    loadComponent: () =>
      import('./pages/workwear/workwear-product').then((m) => m.WorkwearProduct),
  },
  {
    path: 'shoes',
    loadComponent: () =>
      import('./pages/coming-soon/coming-soon').then((m) => m.ComingSoon),
    data: { title: 'Обувь' },
  },
  {
    path: 'gloves',
    loadComponent: () =>
      import('./pages/coming-soon/coming-soon').then((m) => m.ComingSoon),
    data: { title: 'Перчатки' },
  },
  {
    path: 'ppe',
    loadComponent: () =>
      import('./pages/coming-soon/coming-soon').then((m) => m.ComingSoon),
    data: { title: 'СИЗ' },
  },
  {
    path: 'other',
    loadComponent: () =>
      import('./pages/coming-soon/coming-soon').then((m) => m.ComingSoon),
    data: { title: 'Другое' },
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/admin').then((m) => m.Admin),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'workwear' },
      {
        path: 'workwear',
        loadComponent: () =>
          import('./pages/admin/workwear/admin-workwear-list').then(
            (m) => m.AdminWorkwearList,
          ),
      },
      {
        path: 'workwear/new',
        loadComponent: () =>
          import('./pages/admin/workwear/admin-workwear-form').then(
            (m) => m.AdminWorkwearForm,
          ),
      },
      {
        path: 'workwear/:id',
        loadComponent: () =>
          import('./pages/admin/workwear/admin-workwear-form').then(
            (m) => m.AdminWorkwearForm,
          ),
      },
      {
        path: 'shoes',
        loadComponent: () =>
          import('./pages/admin/admin-coming-soon').then((m) => m.AdminComingSoon),
        data: { title: 'Обувь' },
      },
      {
        path: 'gloves',
        loadComponent: () =>
          import('./pages/admin/admin-coming-soon').then((m) => m.AdminComingSoon),
        data: { title: 'Перчатки' },
      },
      {
        path: 'ppe',
        loadComponent: () =>
          import('./pages/admin/admin-coming-soon').then((m) => m.AdminComingSoon),
        data: { title: 'СИЗ' },
      },
      {
        path: 'other',
        loadComponent: () =>
          import('./pages/admin/admin-coming-soon').then((m) => m.AdminComingSoon),
        data: { title: 'Другое' },
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
