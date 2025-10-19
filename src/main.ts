import { provideRouter, withComponentInputBinding } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/login/login.component';
import { authGuard } from './app/auth.guard';
import { AuthService } from './app/auth.service';

const routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: AppComponent, canActivate: [authGuard] }
];

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(ReactiveFormsModule),
    provideRouter(routes, withComponentInputBinding()),
    AuthService
  ]
}).catch(err => console.error(err));