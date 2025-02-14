import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar); // Inyecta MatSnackBar

  return next(req).pipe(
    timeout(5000), // Timeout de 5 segundos
    catchError((error: any) => {
      let errorMessage = 'Error desconocido';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente (por ejemplo, problemas de red)
        errorMessage = `Error de red: ${error.message}`;
      } else {
        // El backend no respondió o devolvió un código de error
        if (error.status === 0) {
          errorMessage =
            'El servicio no está disponible. Por favor, inténtalo más tarde.';
        } else {
          errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
        }
      }

      // Mostrar el mensaje de error al usuario
      snackBar.open(errorMessage, 'Cerrar', {
        duration: 5000, // Duración del mensaje en milisegundos
        panelClass: ['error-snackbar'], // Clase CSS personalizada
      });

      // Lanzar el error para que pueda ser manejado por otros componentes si es necesario
      return throwError(() => new Error(errorMessage));
    })
  );
};