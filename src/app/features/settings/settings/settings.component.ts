import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSnackBarModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  private fb = inject(FormBuilder);
  private themeService = inject(ThemeService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  settingsForm: FormGroup;
  isDarkTheme = this.themeService.isDarkTheme;

  constructor() {
    const currentUsername = this.authService.getCurrentUsername() || 'admin';
    console.log('SettingsComponent initialized, currentUsername:', currentUsername);
    this.settingsForm = this.fb.group({
      username: [currentUsername, [Validators.required, Validators.minLength(3)]],
      darkTheme: [this.isDarkTheme()]
    });
    this.settingsForm.get('darkTheme')?.valueChanges.subscribe(value => {
      if (value !== this.isDarkTheme()) {
        console.log('Toggling theme to:', value);
        this.themeService.toggleTheme();
      }
    });
  }

  onSubmit() {
    console.log('onSubmit called at', new Date().toISOString());
    console.log('Form valid:', this.settingsForm.valid);
    console.log('Form value:', this.settingsForm.value);
    if (this.settingsForm.valid) {
      const { username } = this.settingsForm.value;
      this.authService.updateUsername(username);
      this.snackBar.open('تنظیمات با موفقیت ذخیره شد!', 'بستن', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      console.log('تنظیمات ذخیره شد:', { username, darkTheme: this.isDarkTheme() });
      console.log('localStorage after save:', { adminUsername: localStorage.getItem('adminUsername') });
    } else {
      console.log('فرم نامعتبر است، ذخیره نشد.');
    }
  }

  logout() {
    console.log('Logout called from SettingsComponent');
    this.authService.logout();
    this.router.navigate(['/']);
  }
}