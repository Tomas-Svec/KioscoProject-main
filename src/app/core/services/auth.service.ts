import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiry: string; // Fecha de expiración del refresh token
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7262/api'; // Reemplaza con la URL de tu backend
  private currentUser: any | null = null;
  

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  

  // Método para iniciar sesión
  login(email: string, password: string): Observable<AuthResponse> {
    const loginData = { email, password };
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, loginData).pipe(
      tap((response) => {
        this.saveUserData(response);
        this.getCurrentUser().subscribe((user) => {
          this.currentUser = user; // Actualiza la propiedad privada
        });
      }),
      catchError(this.handleError)
    );
  }

   // Método para registrar un nuevo usuario
  register(nombre: string, apellido: string, email: string, password: string, rol: string): Observable<any> {
    const userData = { nombre, apellido, email, password, rol };
    return this.http.post(`${this.apiUrl}/auth/register`, userData).pipe(
      catchError(this.handleError)
    );
  }
  

  // Método para cerrar sesión
logout(): void {
  if (isPlatformBrowser(this.platformId)) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('refreshTokenExpiry');
  }
}

  // Verifica si el usuario está autenticado
isAuthenticated(): boolean {
  if (isPlatformBrowser(this.platformId)) {
    const token = localStorage.getItem('accessToken');
    return !!token; // Retorna true si existe un token
  }
  return false;
}

  // Guarda los tokens en el almacenamiento local
  saveUserData(response: AuthResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      if (response.refreshTokenExpiry) {
        localStorage.setItem('refreshTokenExpiry', response.refreshTokenExpiry.toString());
      }
    }
  }

  // Método para refrescar el token
  refreshToken(refreshToken: string): Observable<AuthResponse> {
    const refreshTokenData = { refreshToken };
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/refresh-token`, refreshTokenData).pipe(
      tap((response) => {
        this.saveUserData(response);
      }),
      catchError(this.handleError)
    );
  }
  // Método para verificar si el refresh token ha expirado
  isRefreshTokenExpired(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const expiryString = localStorage.getItem('refreshTokenExpiry');
      if (!expiryString) return true;
      const expiry = new Date(expiryString);
      const now = new Date();
      return now > expiry;
    }
    return true;
  }

  // Método para obtener el perfil del usuario
  getCurrentUser(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getAccessToken()}`
      })
    };
  
    return this.http.get<any>(`${this.apiUrl}/auth/profile`, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener el token de acceso
  private getAccessToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  // Manejo de errores HTTP
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Error en la petición HTTP'));
  }


 
}