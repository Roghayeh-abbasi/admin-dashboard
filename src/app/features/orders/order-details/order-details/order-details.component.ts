import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { Order } from '../../../../core/models/order.model';
import { OrderStatusPipe } from '../../../../shared/pipes/order-status.pipe';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule, RouterModule, OrderStatusPipe],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderDetailsComponent {
  orderService = inject(OrderService);
  route = inject(ActivatedRoute);

  order = signal<Order | null>(null);
  error = signal<string | null>(null);
  displayedColumns = ['productId', 'title', 'quantity', 'price'];

  constructor() {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.orderService.getOrder(id);
      })
    ).subscribe({
      next: (order) => {
        this.order.set(order);
        this.error.set(null);
      },
      error: (err) => {
        this.error.set('خطایی در بارگذاری سفارش رخ داد. لطفاً دوباره تلاش کنید.');
      }
    });
  }
}