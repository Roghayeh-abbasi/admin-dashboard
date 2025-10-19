import { Component, signal, computed, inject, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { OrderStatusFormComponent } from '../order-status-form/order-status-form/order-status-form.component';
import { OrderStatusPipe } from '../../../shared/pipes/order-status.pipe';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    RouterModule,
    OrderStatusPipe
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('rowAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class OrdersComponent {
  orderService = inject(OrderService);
  dialog = inject(MatDialog);

  orders = signal<Order[]>([]);
  searchQuery = signal<string>('');
  selectedStatus = signal<string>('');
  pageIndex = signal<number>(0);
  pageSize = signal<number>(5);
  error = signal<string | null>(null);
  displayedColumns = ['id', 'userName', 'total', 'status', 'createdAt', 'actions'];
  statuses = Object.values(OrderStatus);

  filteredOrders = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const status = this.selectedStatus();
    const orders = this.orders();
    const filtered = orders.filter(o =>
      (o.userName || '').toLowerCase().includes(query) &&
      (!status || o.status.toUpperCase() === status.toUpperCase())
    );
    return filtered;
  });

  paginatedOrders = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredOrders().slice(start, end);
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        const normalizedOrders = orders.map(order => ({
          ...order,
          status: order.status.toUpperCase().replace('CANCELLED', 'CANCELED') as OrderStatus
        }));
        this.orders.set(normalizedOrders);
        this.error.set(null);
      },
      error: (err) => {
        this.error.set('خطا در بارگذاری سفارش‌ها. لطفاً دوباره تلاش کنید.');
      }
    });
  }

  filterOrders() {
    this.pageIndex.set(0);
  }

  onPageChange(event: any) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  openStatusForm(order: Order) {
    const dialogRef = this.dialog.open(OrderStatusFormComponent, {
      data: { id: order.id, status: order.status },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.status) {
        this.orderService.updateOrderStatus(order.id, result.status).subscribe({
          next: (updated) => {
            this.orders.update(orders =>
              orders.map(o => o.id === updated.id ? { ...o, status: updated.status } : o)
            );
            this.error.set(null);
          },
          error: (err) => {
            this.error.set('خطا در تغییر وضعیت سفارش. لطفاً دوباره تلاش کنید.');
          }
        });
      }
    });
  }
}