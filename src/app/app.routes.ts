import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { AppComponent } from './app.component';
import { authGuard } from './core/services/auth.guard';

export const routes: Routes = [

  { path: '', component: LoginComponent },
  {
    path: '',
    redirectTo: '/orders',
    pathMatch: 'full',
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/products/products.component').then(c => c.ProductsComponent),
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./features/orders/orders/orders.component').then(c => c.OrdersComponent),
  },
  {
    path: 'orders/:id',
    loadComponent: () =>
      import('./features/orders/order-details/order-details/order-details.component').then(c => c.OrderDetailsComponent),
  },
  { path: 'dashboard', component: AppComponent, canActivate: [authGuard] },
];