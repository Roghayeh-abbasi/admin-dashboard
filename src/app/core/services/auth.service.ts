import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private defaultUsername = 'admin';
  private defaultPassword = 'admin123';
  private currentUsername: string;

  constructor() {
    const storedUsername = localStorage.getItem('adminUsername');
    this.currentUsername = storedUsername !== null ? storedUsername : this.defaultUsername;
  }

  login(username: string, password: string): boolean {
    const isValid = username === this.currentUsername && password === this.defaultPassword;
    if (isValid) {
      const token = 'fake-token-' + Date.now();
      localStorage.setItem('authToken', token);
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('authToken');
  }

  get isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  updateUsername(newUsername: string) {
    this.currentUsername = newUsername;
    localStorage.setItem('adminUsername', newUsername);
  }

  getCurrentUsername(): string {
    const storedUsername = localStorage.getItem('adminUsername');
    this.currentUsername = storedUsername !== null ? storedUsername : this.defaultUsername;
    return this.currentUsername;
  }
}