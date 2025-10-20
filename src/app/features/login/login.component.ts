import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  loginForm!: FormGroup;
  errorMessage: string = '';

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

 onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
     
      const validAdmins = [
        { username: 'admin', password: 'admin123', role: 'admin' }
      ];
      const admin = validAdmins.find(u => u.username === username && u.password === password);
      if (admin) {
        const token = 'fake-token-' + Date.now();
        localStorage.setItem('authToken', token);
        localStorage.setItem('username', username); 
        this.loginForm.reset();
        this.errorMessage = '';
        this.router.navigate(['/admin']);
      } else {
        this.errorMessage = 'فقط ادمین با نام کاربری و رمز معتبر می‌تواند وارد شود!';
      }
    } else {
      this.errorMessage = 'لطفاً فرم را به‌درستی پر کنید.';
    }
  }
}