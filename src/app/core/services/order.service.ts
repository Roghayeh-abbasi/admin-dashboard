import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';
import { Order, OrderStatus } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private baseUrl = 'http://localhost:3000/orders';
  private cachedOrders: Order[] | null = null;

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    if (this.cachedOrders) {
      return of(this.cachedOrders);
    }
    return this.http.get<Order[]>(this.baseUrl).pipe(
      timeout(5000),
      tap(orders => {
        this.cachedOrders = orders.map(order => ({
          ...order,
          status: order.status.toUpperCase().replace('CANCELLED', 'CANCELED') as OrderStatus
        }));
      }),
      catchError(err => {
        throw new Error('خطا در دریافت لیست سفارش‌ها. لطفاً اتصال به سرور را بررسی کنید.');
      })
    );
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`).pipe(
      timeout(5000),
      tap(order => ({
        ...order,
        status: order.status.toUpperCase().replace('CANCELLED', 'CANCELED') as OrderStatus
      })),
      catchError(err => {
        if (err.status === 404) {
          throw new Error(`سفارش با شناسه ${id} یافت نشد.`);
        }
        throw new Error(`خطا در دریافت سفارش با شناسه ${id}. لطفاً دوباره تلاش کنید.`);
      })
    );
  }

  updateOrderStatus(id: number, status: OrderStatus): Observable<Order> {
    return this.http.patch<Order>(`${this.baseUrl}/${id}`, { status }).pipe(
      timeout(5000),
      tap(updated => {
        if (this.cachedOrders) {
          this.cachedOrders = this.cachedOrders.map(o => 
            o.id === updated.id ? { ...o, status: status.toUpperCase().replace('CANCELLED', 'CANCELED') as OrderStatus } : o
          );
        }
      }),
      catchError(err => {
        if (err.status === 404) {
          throw new Error(`سفارش با شناسه ${id} یافت نشد.`);
        }
        throw new Error(`خطا در به‌روزرسانی وضعیت سفارش با شناسه ${id}. لطفاً دوباره تلاش کنید.`);
      })
    );
  }
}