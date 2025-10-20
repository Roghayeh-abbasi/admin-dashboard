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
    console.log('AuthService initialized, currentUsername:', this.currentUsername);
  }

  login(username: string, password: string): boolean {
    console.log('Login attempt with username:', username, 'currentUsername:', this.currentUsername);
    console.log('Password provided:', password, 'expectedPassword:', this.defaultPassword);
    console.log('Stored adminUsername in localStorage:', localStorage.getItem('adminUsername'));
    const isValid = username === this.currentUsername && password === this.defaultPassword;
    if (isValid) {
      const token = 'fake-token-' + Date.now();
      localStorage.setItem('authToken', token);
      console.log('Login successful, token:', token);
      return true;
    }
    console.log('Login failed, expected username:', this.currentUsername, 'expected password:', this.defaultPassword);
    return false;
  }

  logout() {
    console.log('Logout called, keeping adminUsername:', localStorage.getItem('adminUsername'));
    localStorage.removeItem('authToken');
  }

  get isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');
    console.log('Checking isLoggedIn, token:', token);
    return !!token;
  }

  updateUsername(newUsername: string) {
    console.log('Updating username to:', newUsername);
    this.currentUsername = newUsername;
    localStorage.setItem('adminUsername', newUsername);
    console.log('Username saved to localStorage:', localStorage.getItem('adminUsername'));
  }

  getCurrentUsername(): string {
    const storedUsername = localStorage.getItem('adminUsername');
    this.currentUsername = storedUsername !== null ? storedUsername : this.defaultUsername;
    console.log('Getting currentUsername:', this.currentUsername);
    return this.currentUsername;
  }
}