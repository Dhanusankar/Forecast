# HIERARCHICAL MVC - COMPONENT TEMPLATE EXAMPLES

## 1. SHARED COMPONENT TEMPLATE: kpi-card.component.ts

```typescript
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

/**
 * KPI Card Component
 * Reusable across all features
 * Displays: title, value, icon, trend
 */
@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule],
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.scss']
})
export class KpiCardComponent {
  @Input() title: string = '';
  @Input() value: number = 0;
  @Input() label: string = '';
  @Input() icon: string = 'trending_up';
  @Input() trend: number = 0;
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
}
```

## 2. SHARED SERVICE TEMPLATE: chart.service.ts

```typescript
import { Injectable } from '@angular/core';
import { Forecast } from '../../core/models/forecast.model';

export interface ChartDataSet {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

@Injectable({ providedIn: 'root' })
export class ChartService {
  
  /**
   * Generate trend chart from forecasts
   * Groups by department, sums revenue and profit
   */
  generateTrendChart(forecasts: Forecast[]): ChartDataSet {
    const departmentMap = new Map<string, { profit: number; revenue: number }>();
    
    forecasts.forEach(f => {
      const key = f.department;
      const profit = (f.revenue || 0) - (f.expense || 0);
      
      if (departmentMap.has(key)) {
        const existing = departmentMap.get(key)!;
        existing.profit += profit;
        existing.revenue += f.revenue || 0;
      } else {
        departmentMap.set(key, { profit, revenue: f.revenue || 0 });
      }
    });
    
    const sorted = Array.from(departmentMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]));
    
    return {
      labels: sorted.map(([dept]) => dept),
      datasets: [
        {
          label: 'Revenue',
          data: sorted.map(([, data]) => data.revenue),
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)'
        },
        {
          label: 'Profit',
          data: sorted.map(([, data]) => data.profit),
          borderColor: '#2196F3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)'
        }
      ]
    };
  }
}
```

## 3. CORE SERVICE TEMPLATE: dashboard.service.ts

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardData {
  trends: TrendData[];
  kpis: KpiData[];
  summary: SummaryData;
}

export interface TrendData {
  department: string;
  profit: number;
  revenue: number;
  expense: number;
}

export interface KpiData {
  title: string;
  value: number;
  icon: string;
  trend: number;
}

export interface SummaryData {
  totalRevenue: number;
  totalExpense: number;
  totalProfit: number;
  departmentCount: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly API_URL = 'http://localhost:8080/api/dashboard';
  
  constructor(private http: HttpClient) {}
  
  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.API_URL}/overview`);
  }
  
  getTrendData(): Observable<TrendData[]> {
    return this.http.get<TrendData[]>(`${this.API_URL}/trend`);
  }
  
  getKpiData(): Observable<KpiData[]> {
    return this.http.get<KpiData[]>(`${this.API_URL}/kpi`);
  }
}
```

## 4. FEATURE COMPONENT TEMPLATE: home-page.component.ts

```typescript
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { DashboardService } from '../../../core/services/dashboard.service';

/**
 * Home Page Component - Container/Smart Component
 * Loads data from services and passes to child components
 */
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, DashboardComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  isLoading = signal(false);
  dashboardData = signal<any>(null);
  error = signal<string | null>(null);
  
  constructor(private dashboardService: DashboardService) {}
  
  ngOnInit(): void {
    this.loadDashboard();
  }
  
  private loadDashboard(): void {
    this.isLoading.set(true);
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load dashboard');
        this.isLoading.set(false);
      }
    });
  }
}
```

## 5. DASHBOARD COMPONENT TEMPLATE: dashboard.component.ts

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiCardComponent } from '../../../shared/components/kpi-card.component';
import { TrendChartComponent } from './trend-chart/trend-chart.component';

/**
 * Dashboard Component - Presentational/Dumb Component
 * Receives data via @Input, emits events via @Output
 * Uses shared components (KpiCardComponent)
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, KpiCardComponent, TrendChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  @Input() data: any;
  @Output() refresh = new EventEmitter<void>();
  
  onRefresh(): void {
    this.refresh.emit();
  }
}
```

## 6. FEATURE PAGE ROUTING TEMPLATE: home-routing.module.ts

```typescript
import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    component: HomePageComponent
  }
];
```

## 7. FEATURE MODULE TEMPLATE: forecast-page.component.ts

```typescript
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ForecastListComponent } from '../components/forecast-list/forecast-list.component';
import { ForecastFilterComponent } from '../components/forecast-filter/forecast-filter.component';
import { ForecastService } from '../../../core/services/forecast.service';
import { Forecast } from '../../../core/models/forecast.model';

/**
 * Forecast Page Component - Container/Smart Component
 * Manages forecast data and coordinates child components
 */
@Component({
  selector: 'app-forecast-page',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    ForecastListComponent,
    ForecastFilterComponent
  ],
  templateUrl: './forecast-page.component.html',
  styleUrls: ['./forecast-page.component.scss']
})
export class ForecastPageComponent implements OnInit {
  forecasts$ = signal<Forecast[]>([]);
  isLoading = signal(false);
  currentPage = 0;
  pageSize = 10;
  
  constructor(private forecastService: ForecastService) {}
  
  ngOnInit(): void {
    this.loadForecasts();
  }
  
  loadForecasts(): void {
    this.isLoading.set(true);
    this.forecastService.getForecastsWithFilters({}, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          this.forecasts$.set(response.content);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error loading forecasts:', err);
          this.isLoading.set(false);
        }
      });
  }
  
  onFilterChange(filters: any): void {
    this.currentPage = 0;
    this.loadForecasts();
  }
  
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadForecasts();
  }
}
```

## 8. SHARED COMPONENT IN FEATURE: kpi-section.component.html

```html
<div class="kpi-section">
  <h2>Key Performance Indicators</h2>
  
  <div class="kpi-grid">
    <app-kpi-card
      *ngFor="let kpi of kpis"
      [title]="kpi.title"
      [value]="kpi.value"
      [label]="kpi.label"
      [icon]="kpi.icon"
      [trend]="kpi.trend"
      [color]="kpi.color">
    </app-kpi-card>
  </div>
</div>
```

## 9. ROOT ROUTING TEMPLATE: app.routes.ts

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./features/home/home-routing.module')
      .then(m => m.HOME_ROUTES)
  },
  {
    path: 'forecasts',
    loadChildren: () => import('./features/finance-forecast/finance-forecast-routing.module')
      .then(m => m.FINANCE_FORECAST_ROUTES)
  },
  {
    path: 'spending',
    loadChildren: () => import('./features/spending-forecast/spending-forecast-routing.module')
      .then(m => m.SPENDING_FORECAST_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
```

## 10. ROOT COMPONENT TEMPLATE: app.component.ts

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from './shared/components/header/header.component';

/**
 * Root App Component
 * Layout shell for entire application
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    HeaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Financial Forecasting System';
}
```

## Summary of Patterns

```typescript
// ✅ SMART/CONTAINER COMPONENTS (Load data)
// Handles: Data fetching, state management
// Injects: Services
// Uses: Child components, signals
// Example: home-page.component, forecast-page.component

// ✅ PRESENTATIONAL/DUMB COMPONENTS (Display data)
// Handles: Rendering only
// Receives: @Input properties
// Emits: @Output events
// Uses: HTML, CSS, child components (shared)
// Example: dashboard.component, kpi-section.component

// ✅ SHARED COMPONENTS (Pure UI)
// Generic, reusable across features
// No services, no data fetching
// Only @Input/@Output
// Example: kpi-card.component, summary-card.component

// ✅ SHARED SERVICES (Utilities)
// Pure logic, no Angular specifics
// Reusable across features
// Example: chart.service, format.service

// ✅ CORE SERVICES (API calls)
// HTTP communication
// Injected by features
// Example: forecast.service, spending.service, dashboard.service
```

Ready to implement? Start with the shared layer! 🚀
