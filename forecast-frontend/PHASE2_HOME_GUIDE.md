# PHASE 2: HOME FEATURE (DASHBOARD) - IMPLEMENTATION GUIDE

## What We're Building

A complete dashboard showing:
- KPI cards (Total Revenue, Total Expense, Total Profit, Avg Profit Margin)
- Trend chart (Revenue vs Expense over time)
- Department performance cards
- Summary statistics
- Year filter dropdown

---

## Folder Structure to Create

```
src/app/features/home/
├── pages/
│   └── home-page/
│       ├── home-page.component.ts
│       ├── home-page.component.html
│       └── home-page.component.scss
├── components/
│   ├── dashboard/
│   │   ├── dashboard.component.ts
│   │   ├── dashboard.component.html
│   │   └── dashboard.component.scss
│   ├── trend-chart/
│   │   ├── trend-chart.component.ts
│   │   ├── trend-chart.component.html
│   │   └── trend-chart.component.scss
│   ├── kpi-section/
│   │   ├── kpi-section.component.ts
│   │   ├── kpi-section.component.html
│   │   └── kpi-section.component.scss
│   └── department-cards/
│       ├── department-cards.component.ts
│       ├── department-cards.component.html
│       └── department-cards.component.scss
└── home-routing.module.ts
```

---

## Step-by-Step Implementation

### Step 1: Create home-page.component.ts (Smart/Container)

```typescript
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

// Import services
import { DashboardService, DashboardOverview, FormatService } from '../../../core';

// Import shared components
import { HeaderComponent, LoadingSpinnerComponent, ErrorAlertComponent } from '../../../shared';

// Import feature components
import { DashboardComponent } from '../components/dashboard/dashboard.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    HeaderComponent,
    LoadingSpinnerComponent,
    ErrorAlertComponent,
    DashboardComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  // State signals
  dashboardData$ = signal<DashboardOverview | null>(null);
  isLoading$ = signal<boolean>(false);
  error$ = signal<string | null>(null);

  // Form
  filterForm: FormGroup;

  // Available years
  years = [2024, 2025, 2026, 2027, 2028];

  constructor(
    private dashboardService: DashboardService,
    private formBuilder: FormBuilder,
    public formatService: FormatService
  ) {
    this.filterForm = this.formBuilder.group({
      year: [new Date().getFullYear()]
    });
  }

  ngOnInit(): void {
    this.loadDashboard();
    this.filterForm.valueChanges.subscribe(() => this.loadDashboard());
  }

  loadDashboard(): void {
    this.isLoading$.set(true);
    this.error$.set(null);

    const year = this.filterForm.get('year')?.value;

    this.dashboardService.getOverview({ year }).subscribe({
      next: (data) => {
        this.dashboardData$.set(data);
        this.isLoading$.set(false);
      },
      error: (err) => {
        const errorMessage = err.error?.error || 'Failed to load dashboard';
        this.error$.set(errorMessage);
        this.isLoading$.set(false);
      }
    });
  }

  clearError(): void {
    this.error$.set(null);
  }

  onMenuToggle(): void {
    // TODO: Toggle sidebar
  }
}
```

### Step 2: Create home-page.component.html

```html
<app-header [title]="'Financial Dashboard'" (menuToggle)="onMenuToggle()"></app-header>

<div class="home-container">
  <!-- Error Alert -->
  <app-error-alert [error]="error$()" (dismiss)="clearError()"></app-error-alert>

  <!-- Filter Section -->
  <div class="filter-section">
    <mat-form-field appearance="outline">
      <mat-label>Year</mat-label>
      <mat-select [formControl]="filterForm.get('year')!">
        <mat-option *ngFor="let year of years" [value]="year">
          {{ year }}
        </mat-option>
      </mat-select>
    </mat-form-field>
  </div>

  <!-- Loading Spinner -->
  <app-loading-spinner [isLoading]="isLoading$()"></app-loading-spinner>

  <!-- Dashboard Content -->
  <div *ngIf="dashboardData$() && !isLoading$()" class="dashboard-content">
    <app-dashboard [data]="dashboardData$()!" [formatService]="formatService"></app-dashboard>
  </div>
</div>
```

### Step 3: Create home-page.component.scss

```scss
.home-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.filter-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f5f5f5;
  border-radius: 8px;

  mat-form-field {
    min-width: 150px;
  }
}

.dashboard-content {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .home-container {
    padding: 1rem;
  }

  .filter-section {
    flex-wrap: wrap;
  }
}
```

### Step 4: Create dashboard.component.ts (Dumb/Presentational)

```typescript
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

import { DashboardOverview, FormatService } from '../../../core';
import { KpiCardComponent, SummaryCardComponent } from '../../../shared';
import { TrendChartComponent } from '../trend-chart/trend-chart.component';
import { DepartmentCardsComponent } from '../department-cards/department-cards.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    KpiCardComponent,
    SummaryCardComponent,
    TrendChartComponent,
    DepartmentCardsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  @Input() data!: DashboardOverview;
  @Input() formatService!: FormatService;
}
```

### Step 5: Create dashboard.component.html

```html
<div class="dashboard-grid">
  <!-- KPI Cards Section -->
  <div class="kpi-section">
    <h2>Key Performance Indicators</h2>
    <div class="kpi-cards">
      <app-kpi-card
        *ngFor="let kpi of data.kpis"
        [title]="kpi.title"
        [value]="kpi.value"
        [label]="kpi.unit"
        [icon]="kpi.icon"
        [trend]="kpi.trend"
        [color]="kpi.color as any">
      </app-kpi-card>
    </div>
  </div>

  <!-- Trends Section -->
  <div class="trends-section">
    <mat-card>
      <mat-card-header>
        <mat-card-title>Revenue vs Expense Trend</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <app-trend-chart [trendData]="data.trendData"></app-trend-chart>
      </mat-card-content>
    </mat-card>
  </div>

  <!-- Summary Stats Section -->
  <div class="summary-section">
    <h2>Summary Statistics</h2>
    <div class="summary-cards">
      <app-summary-card
        [title]="'Total Revenue'"
        [value]="data.summaryStats.totalRevenue"
        [subtitle]="formatService.formatCurrency(data.summaryStats.totalRevenue)"
        [icon]="'trending_up'"
        [background]="'#e8f5e9'">
      </app-summary-card>

      <app-summary-card
        [title]="'Total Expense'"
        [value]="data.summaryStats.totalExpense"
        [subtitle]="formatService.formatCurrency(data.summaryStats.totalExpense)"
        [icon]="'trending_down'"
        [background]="'#ffebee'">
      </app-summary-card>

      <app-summary-card
        [title]="'Total Profit'"
        [value]="data.summaryStats.totalProfit"
        [subtitle]="formatService.formatCurrency(data.summaryStats.totalProfit)"
        [icon]="'done'"
        [background]="'#e3f2fd'">
      </app-summary-card>
    </div>
  </div>

  <!-- Department Performance Section -->
  <div class="department-section">
    <app-department-cards [departments]="data.departmentPerformance" [formatService]="formatService"></app-department-cards>
  </div>
</div>
```

### Step 6: Create dashboard.component.scss

```scss
.dashboard-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.kpi-section {
  h2 {
    margin: 0 0 1.5rem 0;
    font-size: 1.25rem;
    color: #333;
    font-weight: 600;
  }

  .kpi-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }
}

.trends-section {
  mat-card {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    mat-card-header {
      margin-bottom: 1rem;
    }

    mat-card-title {
      font-size: 1rem;
      margin: 0;
    }
  }
}

.summary-section {
  h2 {
    margin: 0 0 1.5rem 0;
    font-size: 1.25rem;
    color: #333;
    font-weight: 600;
  }

  .summary-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
  }
}

.department-section {
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .dashboard-grid {
    gap: 1rem;
  }

  .kpi-cards {
    grid-template-columns: 1fr !important;
  }

  .summary-cards {
    grid-template-columns: 1fr !important;
  }
}
```

### Step 7: Create trend-chart.component.ts

```typescript
import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';

import { TrendData } from '../../../core';

Chart.register(...registerables);

@Component({
  selector: 'app-trend-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './trend-chart.component.html',
  styleUrls: ['./trend-chart.component.scss']
})
export class TrendChartComponent implements AfterViewInit {
  @Input() trendData: TrendData[] = [];
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  chartData: any;
  chartOptions: any;

  ngAfterViewInit(): void {
    if (this.trendData.length > 0) {
      this.prepareChartData();
    }
  }

  prepareChartData(): void {
    const labels = this.trendData.map(d => d.month);
    const revenueData = this.trendData.map(d => d.revenue);
    const expenseData = this.trendData.map(d => d.expense);

    this.chartData = {
      labels,
      datasets: [
        {
          label: 'Revenue',
          data: revenueData,
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 2
        },
        {
          label: 'Expense',
          data: expenseData,
          borderColor: '#f44336',
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 2
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value: any) => '$' + (value / 1000).toFixed(0) + 'K'
          }
        }
      }
    };
  }
}
```

### Step 8: Create trend-chart.component.html

```html
<canvas
  baseChart
  [data]="chartData"
  [options]="chartOptions"
  type="line"
  *ngIf="chartData">
</canvas>

<div class="no-data" *ngIf="!chartData">
  <p>No trend data available</p>
</div>
```

### Step 9: Create trend-chart.component.scss

```scss
canvas {
  max-height: 400px;
}

.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  color: #999;
  font-size: 1rem;
}
```

### Step 10: Create department-cards.component.ts

```typescript
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { DepartmentPerformance, FormatService } from '../../../core';
import { SummaryCardComponent } from '../../../shared';

@Component({
  selector: 'app-department-cards',
  standalone: true,
  imports: [CommonModule, MatCardModule, SummaryCardComponent],
  templateUrl: './department-cards.component.html',
  styleUrls: ['./department-cards.component.scss']
})
export class DepartmentCardsComponent {
  @Input() departments: DepartmentPerformance[] = [];
  @Input() formatService!: FormatService;
}
```

### Step 11: Create department-cards.component.html

```html
<mat-card class="department-card-container">
  <mat-card-header>
    <mat-card-title>Department Performance</mat-card-title>
  </mat-card-header>

  <mat-card-content>
    <div class="department-grid">
      <div *ngFor="let dept of departments" class="department-item">
        <h3>{{ dept.department }}</h3>
        <div class="metrics">
          <div class="metric">
            <span class="label">Revenue:</span>
            <span class="value">{{ formatService.formatCurrency(dept.revenue) }}</span>
          </div>
          <div class="metric">
            <span class="label">Expense:</span>
            <span class="value">{{ formatService.formatCurrency(dept.expense) }}</span>
          </div>
          <div class="metric">
            <span class="label">Profit:</span>
            <span class="value" [ngClass]="dept.profit >= 0 ? 'positive' : 'negative'">
              {{ formatService.formatCurrency(dept.profit) }}
            </span>
          </div>
          <div class="metric">
            <span class="label">Margin:</span>
            <span class="value">{{ formatService.formatPercentage(dept.profitMargin) }}</span>
          </div>
        </div>
      </div>
    </div>
  </mat-card-content>
</mat-card>
```

### Step 12: Create department-cards.component.scss

```scss
.department-card-container {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  mat-card-header {
    margin-bottom: 1.5rem;
  }

  mat-card-title {
    font-size: 1rem;
    margin: 0;
  }
}

.department-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.department-item {
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fafafa;

  h3 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    color: #333;
    font-weight: 600;
  }

  .metrics {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .metric {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;

    .label {
      color: #666;
      font-weight: 500;
    }

    .value {
      color: #333;
      font-weight: 600;
      text-align: right;

      &.positive {
        color: #4caf50;
      }

      &.negative {
        color: #f44336;
      }
    }
  }
}

@media (max-width: 768px) {
  .department-grid {
    grid-template-columns: 1fr;
  }
}
```

### Step 13: Create home-routing.module.ts

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

---

## Summary for This Phase

**Components to Create: 5**
- home-page (Smart - loads data)
- dashboard (Dumb - displays overview)
- trend-chart (Dumb - displays chart)
- department-cards (Dumb - displays departments)
- home-routing (Route config)

**Files to Create: 16**
- 5 .ts components
- 5 .html templates
- 5 .scss stylesheets
- 1 routing file

**Time Estimate: 2-3 hours**

---

## Ready to Build?

This guide provides complete, copy-paste ready code for the entire Home Feature (Dashboard).

Follow the steps in order and verify each component renders correctly.

**Next Phase: Refactor Finance Forecast Feature**
