import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else if (!this.authService.isRefreshTokenExpired()) {
      // Intenta refrescar el token si el refresh token no ha expirado
      this.authService.refreshToken(localStorage.getItem('refreshToken')!).subscribe(
        (response) => {
          this.authService.saveUserData(response); // Guarda el nuevo token
          this.router.navigate(['/']); // Navega a la página principal
        },
        (error) => {
          this.router.navigate(['/auth/login']); // Redirige al login si falla
        }
      );
      return false; // Retorna false mientras se refresca el token
    } else {
      this.router.navigate(['/auth/login']); // Redirige al login si el refresh token ha expirado
      return false;
    }
  }
}
