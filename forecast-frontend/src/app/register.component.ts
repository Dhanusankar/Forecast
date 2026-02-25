import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>Create Account</mat-card-title>
          <mat-card-subtitle>Join the forecasting system</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form (ngSubmit)="onRegister()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Username</mat-label>
              <input matInput [(ngModel)]="username" name="username" required>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" [(ngModel)]="email" name="email" required>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword() ? 'password' : 'text'" [(ngModel)]="password" name="password" required>
              <button mat-icon-button matSuffix (click)="togglePasswordVisibility()" type="button">
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirm Password</mat-label>
              <input matInput [type]="hideConfirmPassword() ? 'password' : 'text'" [(ngModel)]="confirmPassword" name="confirmPassword" required>
              <button mat-icon-button matSuffix (click)="toggleConfirmPasswordVisibility()" type="button">
                <mat-icon>{{ hideConfirmPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>

            <div class="error-message" *ngIf="errorMessage()">
              {{ errorMessage() }}
            </div>

            <button mat-raised-button color="primary" class="full-width" [disabled]="loading()">
              {{ loading() ? 'Registering...' : 'Register' }}
            </button>
          </form>

          <p class="login-link">
            Already have an account? <a routerLink="/login">Login here</a>
          </p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .register-card {
      width: 100%;
      max-width: 400px;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    }

    mat-card-header {
      text-align: center;
      margin-bottom: 30px;
    }

    mat-form-field {
      margin-bottom: 20px;
    }

    .full-width {
      width: 100%;
    }

    .error-message {
      color: #f44336;
      margin: 15px 0;
      font-size: 14px;
      background: #ffebee;
      padding: 10px;
      border-radius: 4px;
    }

    button[mat-raised-button] {
      margin-top: 20px;
    }

    .login-link {
      text-align: center;
      margin-top: 20px;
      color: #666;
      font-size: 14px;
    }

    .login-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }
  `]
})
export class RegisterComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  loading = signal(false);
  errorMessage = signal('');

  togglePasswordVisibility() {
    this.hidePassword.update(val => !val);
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword.update(val => !val);
  }

  onRegister() {
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage.set('All fields are required');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage.set('Password must be at least 6 characters');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.http.post<any>('https://forecast-1-tpoj.onrender.com/api/auth/register', {
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response));
        this.router.navigate(['/home']);
      },
      error: (error: any) => {
        this.loading.set(false);
        this.errorMessage.set(error.status === 409 ? 'Username already exists' : 'Registration failed');
      }
    });
  }
}
