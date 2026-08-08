import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      if (!this.auth.isAdmin()) {
        void this.router.navigateByUrl('/');
      }
    });
  }
}
