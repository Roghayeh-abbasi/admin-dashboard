import { Routes } from '@angular/router';

export const routes: Routes = [
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
  }
];