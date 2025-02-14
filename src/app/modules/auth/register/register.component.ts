import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { NgIf } from '@angular/common'; // Importa NgIf
import { RouteNavigatorService } from '../../../core/services/route-navigator.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ NgIf,FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  nombre: string = '';
  apellido: string = '';
  email: string = '';
  password: string = '';
  rol: string = 'Empleado'; // Valor predeterminado
  refreshToken: string = ''; // Generar automáticamente o dejar vacío
  refreshTokenExpiry: Date = new Date(); // Fecha de expiración del refresh token
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private routeNavigator: RouteNavigatorService
  ) {}

  ngOnInit(): void {
    // Genera automáticamente el refreshToken y la fecha de expiración
    this.refreshToken = this.generateRefreshToken();
    this.refreshTokenExpiry = this.generateRefreshTokenExpiry();
  }

  onSubmit(): void {
    this.authService.register(this.nombre, this.apellido, this.email, this.password, this.rol).subscribe({
      next: () => {
        this.routeNavigator.navigateToLogin(); // Redirigir al login después del registro
      },
      error: (error) => {
        this.errorMessage = 'Error al registrar el usuario';
      }
    });
  }

  goToLogin(): void {
    this.routeNavigator.navigateToLogin(); // Navega al login
  }

  // Método para generar un refreshToken aleatorio
  private generateRefreshToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Método para generar una fecha de expiración para el refreshToken
  private generateRefreshTokenExpiry(): Date {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7); // Expira en 7 días
    return expiryDate;
  }
}