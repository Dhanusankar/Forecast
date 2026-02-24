import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, RouterModule, MatToolbarModule,
    MatIconModule, MatButtonModule, MatMenuModule
  ],
  template: `
<mat-toolbar color="primary" class="top-navbar">

  <!-- Left Section -->
  <div class="nav-left">
    <span class="app-logo">FinancePro</span>
  </div>

  <!-- Center Navigation -->
  <div class="nav-center">
    <button mat-button routerLink="/home">
      Dashboard
    </button>
    <button mat-button routerLink="/forecasts">
      Forecast
    </button>
    <button mat-button routerLink="/expenses">
      Expenses
    </button>
  </div>

  <!-- Right Section -->
  <div class="nav-right">
    <button mat-button [matMenuTriggerFor]="userMenu" class="user-button">
      User
    </button>
    <mat-menu #userMenu="matMenu">
      <button mat-menu-item>Profile</button>
      <button mat-menu-item>Settings</button>
      <button mat-menu-item (click)="logout()">Logout</button>
    </mat-menu>
  </div>

</mat-toolbar>

<div class="page-content">
  <router-outlet></router-outlet>
</div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    .top-navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      flex-shrink: 0;
    }

    .nav-left {
      flex: 0 0 auto;
    }

    .app-logo {
      font-size: 20px;
      font-weight: 600;
      color: white;
    }

    .nav-center {
      flex: 1;
      display: flex;
      justify-content: center;
      gap: 8px;
    }

    .nav-center button {
      color: white;
      text-transform: capitalize;
    }

    .nav-right {
      flex: 0 0 auto;
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .nav-right button {
      color: white;
      letter-spacing: normal;
    }

    .user-button {
      font-weight: 500;
    }

    .page-content {
      flex: 1;
      overflow: auto;
      background: #f5f5f5;
    }
  `]
})
export class LayoutComponent {
  private router = inject(Router);

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}

