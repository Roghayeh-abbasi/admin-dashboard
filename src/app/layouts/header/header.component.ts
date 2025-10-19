import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatSnackBarModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isDarkMode = signal(localStorage.getItem('theme') === 'dark');
  role = this.authService.role;

  adminNavItems = [
    { name: 'داشبورد', route: '/dashboard' },
    { name: 'کاربران', route: '/users' },
    { name: 'محصولات', route: '/products' },
    { name: 'سفارش‌ها', route: '/orders' },
    { name: 'تنظیمات', route: '/settings' }
  ];

  userNavItems = [
    { name: 'پروفایل', route: '/profile' },
    { name: 'سفارش‌های من', route: '/my-orders' }
  ];

  constructor() {
    if (this.isDarkMode()) {
      document.documentElement.classList.add('dark');
    }
  }

  toggleTheme(): void {
    this.isDarkMode.set(!this.isDarkMode());
    if (this.isDarkMode()) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  logout(): void {
    this.authService.logout();
    this.snackBar.open('با موفقیت خارج شدید', 'بستن', {
      duration: 3000,
      panelClass: ['bg-success-500', 'text-white']
    });
  }
}