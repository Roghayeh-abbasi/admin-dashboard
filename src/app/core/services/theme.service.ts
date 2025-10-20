import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _isDarkTheme = signal<boolean>(false);

  isDarkTheme = this._isDarkTheme.asReadonly();

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this._isDarkTheme.set(true);
      document.documentElement.classList.add('dark');
    }
  }

  toggleTheme() {
    this._isDarkTheme.update(current => {
      const newTheme = !current;
      if (newTheme) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newTheme;
    });
  }
}