import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = 'https://fakestoreapi.com/products';
  private cachedProducts: Product[] | null = null;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    if (this.cachedProducts) {
      return of(this.cachedProducts);
    }
    return this.http.get<Product[]>(this.baseUrl).pipe(
      timeout(5000),
      tap(products => {
        this.cachedProducts = products;
      }),
      catchError(err => {
        throw new Error('خطا در دریافت لیست محصولات. لطفاً اتصال به سرور را بررسی کنید.');
      })
    );
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product).pipe(
      timeout(5000),
      tap(newProduct => {
        if (this.cachedProducts) {
          this.cachedProducts = [...this.cachedProducts, newProduct];
        }
      }),
      catchError(err => {
        throw new Error('خطا در افزودن محصول جدید. لطفاً دوباره تلاش کنید.');
      })
    );
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product).pipe(
      timeout(5000),
      tap(updatedProduct => {
        if (this.cachedProducts) {
          this.cachedProducts = this.cachedProducts.map(p =>
            p.id === id ? { ...p, ...updatedProduct } : p
          );
        }
      }),
      catchError(err => {
        if (err.status === 404) {
          throw new Error(`محصول با شناسه ${id} یافت نشد.`);
        }
        throw new Error(`خطا در به‌روزرسانی محصول با شناسه ${id}. لطفاً دوباره تلاش کنید.`);
      })
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      timeout(5000),
      tap(() => {
        if (this.cachedProducts) {
          this.cachedProducts = this.cachedProducts.filter(p => p.id !== id);
        }
      }),
      catchError(err => {
        if (err.status === 404) {
          throw new Error(`محصول با شناسه ${id} یافت نشد.`);
        }
        throw new Error(`خطا در حذف محصول با شناسه ${id}. لطفاً دوباره تلاش کنید.`);
      })
    );
  }
}