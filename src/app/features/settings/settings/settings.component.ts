import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
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
    MatSlideToggleModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  private fb = inject(FormBuilder);
  private themeService = inject(ThemeService);
  private authService = inject(AuthService);
  private router = inject(Router);

  settingsForm: FormGroup;
  isDarkTheme = this.themeService.isDarkTheme;

  constructor() {
    this.settingsForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      darkTheme: [this.isDarkTheme()]
    });

    this.settingsForm.get('darkTheme')?.valueChanges.subscribe(value => {
      if (value !== this.isDarkTheme()) {
        this.themeService.toggleTheme();
      }
    });
  }

  onSubmit() {
    if (this.settingsForm.valid) {
      const { username } = this.settingsForm.value;
      // اینجا منطق ذخیره تنظیمات (مثل ارسال به API)
      console.log('تنظیمات ذخیره شد:', { username, darkTheme: this.isDarkTheme() });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}