import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';

@Component({
  selector: 'app-local-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatSelectModule, MatFormFieldModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Local Testing - Quick Login</h2>
        <p class="info">Select a test account to login:</p>
        
        <div class="role-buttons">
          <button (click)="loginAsRole('admin')" class="role-btn admin-btn">
            👨‍💼 Admin
            <small>Full Access</small>
          </button>
          <button (click)="loginAsRole('manager')" class="role-btn manager-btn">
            👔 Manager
            <small>Sales Dept Only</small>
          </button>
          <button (click)="loginAsRole('viewer')" class="role-btn viewer-btn">
            👁️ Viewer
            <small>Read Only</small>
          </button>
        </div>
        
        <p class="info">Click a button above to login with that role</p>
      </div>
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
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      text-align: center;
      width: 100%;
      max-width: 450px;
    }

    h2 {
      color: #333;
      margin-bottom: 10px;
    }

    .info {
      color: #666;
      font-size: 14px;
      margin: 15px 0;
    }

    .role-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 30px 0;
    }

    .role-btn {
      padding: 20px;
      font-size: 16px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      display: flex;
      flex-direction: column;
      gap: 5px;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
    }

    .role-btn small {
      font-size: 12px;
      font-weight: 400;
    }

    .admin-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .admin-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
    }

    .manager-btn {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
    }

    .manager-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(245, 87, 108, 0.4);
    }

    .viewer-btn {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
    }

    .viewer-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(79, 172, 254, 0.4);
    }
  `]
})
export class LocalLoginComponent {
  private router = inject(Router);

  loginAsRole(role: string) {
    const mockUser = {
      username: role,
      role: role,
      userId: Math.floor(Math.random() * 1000),
      token: 'mock-token-' + role + '-' + Date.now()
    };

    localStorage.setItem('auth_token', mockUser.token);
    localStorage.setItem('auth_user', JSON.stringify(mockUser));
    
    this.router.navigate(['/home']);
  }
}
