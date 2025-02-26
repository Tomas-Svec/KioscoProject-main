import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('../dashboard/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [AuthGuard], // Protege esta ruta con el guard
    children: [
      {
        path: 'manage-stock',
        loadComponent: () =>
          import('../manage-stock/manage-stock/manage-stock.component').then(
            (m) => m.ManageStockComponent
          ),
      },
    ],
  },
  {
    path: '**', // Cualquier otra ruta no definida
    redirectTo: '/auth/login', // Redirige al login
  },
];