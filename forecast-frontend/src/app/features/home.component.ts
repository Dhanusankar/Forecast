import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule, MatButtonModule],
  template: `
    <div class="home-container">
      <div class="header">
        <h1>Financial Forecasting Dashboard</h1>
        <div class="nav-buttons">
          <button mat-raised-button (click)="router.navigate(['/forecasts'])">Forecasts</button>
          <button mat-raised-button (click)="router.navigate(['/expenses'])">Expenses</button>
          <button mat-raised-button color="warn" (click)="logout()">Logout</button>
        </div>
      </div>
      
      <div class="loading" *ngIf="loading()">
        <mat-spinner></mat-spinner>
      </div>

      <div class="dashboard" *ngIf="!loading() && dashboardData()">
        <h2>KPIs</h2>
        <div class="kpis">
          <mat-card *ngFor="let kpi of dashboardData()?.kpis">
            <mat-card-content>
              <h3>{{ kpi.title }}</h3>
              <p class="value">{{ kpi.value | number:'1.0-0' }}</p>
              <p class="unit">{{ kpi.unit }}</p>
            </mat-card-content>
          </mat-card>
        </div>

        <h2>Departments Performance</h2>
        <div class="departments">
          <mat-card *ngFor="let dept of dashboardData()?.departments">
            <mat-card-content>
              <h3>{{ dept.department }}</h3>
              <p>Revenue: {{ dept.revenue | number:'1.0-0' }}</p>
              <p>Expense: {{ dept.expense | number:'1.0-0' }}</p>
              <p>Profit: {{ dept.profit | number:'1.0-0' }}</p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <div class="error" *ngIf="error()">
        {{ error() }}
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #667eea;
      padding-bottom: 20px;
    }
    .nav-buttons {
      display: flex;
      gap: 10px;
    }
    .kpis, .departments {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }
    mat-card {
      padding: 20px;
    }
    .value {
      font-size: 2em;
      font-weight: bold;
      color: #667eea;
    }
    .loading {
      text-align: center;
      padding: 40px;
    }
  `]
})
export class HomeComponent implements OnInit {
  private http = inject(HttpClient);
  router = inject(Router);
  
  loading = signal(true);
  dashboardData = signal<any>(null);
  error = signal('');

  ngOnInit() {
    this.http.get<any>('https://forecast-1-tpoj.onrender.com/api/dashboard/overview?year=2024')
      .subscribe({
        next: (data) => {
          console.log('Dashboard data received:', data);
          this.dashboardData.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Dashboard error:', err);
          this.error.set('Failed to load dashboard data: ' + (err.status || 'Unknown error'));
          this.loading.set(false);
        }
      });
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.router.navigate(['/login']);
  }
}
