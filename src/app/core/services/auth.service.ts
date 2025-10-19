import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  private userRole = signal<string | null>(localStorage.getItem('role'));

  get isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  get role() {
    return this.userRole.asReadonly();
  }

  login(username: string, password: string): Observable<boolean> {
    // Simulate API call
    let role: string | null = null;
    if (username === 'admin' && password === '1234') {
      role = 'admin';
    } else if (username === 'user' && password === '1234') {
      role = 'user';
    }

    if (role) {
      const token = 'fake-jwt-token'; // In real app, get from API
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      this.isLoggedInSubject.next(true);
      this.userRole.set(role);
      return of(true).pipe(delay(1000));
    } else {
      return of(false).pipe(delay(1000));
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.isLoggedInSubject.next(false);
    this.userRole.set(null);
    this.router.navigate(['/login']);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  constructor(private router: Router) {}
}