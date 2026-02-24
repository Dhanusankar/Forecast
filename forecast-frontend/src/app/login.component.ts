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
  selector: 'app-login',
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
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Financial Forecasting System</mat-card-title>
          <mat-card-subtitle>Login to continue</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form (ngSubmit)="onLogin()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Username</mat-label>
              <input matInput [(ngModel)]="username" name="username" required>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword() ? 'password' : 'text'" [(ngModel)]="password" name="password" required>
              <button mat-icon-button matSuffix (click)="togglePasswordVisibility()" type="button">
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>

            <div class="error-message" *ngIf="errorMessage()">
              {{ errorMessage() }}
            </div>

            <button mat-raised-button color="primary" class="full-width" [disabled]="loading()">
              {{ loading() ? 'Logging in...' : 'Login' }}
            </button>
          </form>

          <p class="signup-link">
            Don't have an account? <a routerLink="/register">Register here</a>
          </p>

          <div class="demo-users">
            <p><strong>Demo Credentials:</strong></p>
            <p>Admin: admin / admin123</p>
            <p>Manager: manager / manager123</p>
            <p>Viewer: viewer / viewer123</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-card {
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

    .signup-link {
      text-align: center;
      margin-top: 20px;
      color: #666;
      font-size: 14px;
    }

    .signup-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .demo-users {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
      margin-top: 20px;
      font-size: 12px;
    }

    .demo-users p {
      margin: 5px 0;
    }
  `]
})
export class LoginComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  username = '';
  password = '';
  hidePassword = signal(true);
  loading = signal(false);
  errorMessage = signal('');

  togglePasswordVisibility() {
    this.hidePassword.update(val => !val);
  }

  onLogin() {
    if (!this.username || !this.password) {
      this.errorMessage.set('Please enter username and password');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.http.post<any>('http://localhost:8080/api/auth/login', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (response) => {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response));
        this.router.navigate(['/home']);
      },
      error: (error: any) => {
        this.loading.set(false);
        this.errorMessage.set(error.status === 401 ? 'Invalid username or password' : 'Login failed');
      }
    });
  }
}
