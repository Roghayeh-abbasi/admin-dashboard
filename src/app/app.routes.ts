import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout/admin-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'orders',
        pathMatch: 'full'
      },
      // {
      //   path: 'dashboard',
      //   loadComponent: () =>
      //     import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent)
      // },
      // {
      //   path: 'users',
      //   loadComponent: () =>
      //     import('./features/users/users.component').then(c => c.UsersComponent)
      // },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/products/products.component').then(c => c.ProductsComponent)
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/orders/orders/orders.component').then(c => c.OrdersComponent)
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import('./features/orders/order-details/order-details/order-details.component').then(c => c.OrderDetailsComponent)
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings/settings.component').then(c => c.SettingsComponent),
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];