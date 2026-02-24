# HIERARCHICAL MVC - VISUAL ARCHITECTURE

## Layer Diagram

```
┌───────────────────────────────────────────────────────────────┐
│                         USER (Browser)                        │
│                    localhost:4200                             │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    ┌───▼────┐      ┌────▼──────┐     ┌──▼──────┐
    │  HOME  │      │ FORECASTS │     │ SPENDING│
    │ FEATURE│      │  FEATURE  │     │ FEATURE │
    │ (/home)│      │(/forecasts)     │(/spending)
    └───┬────┘      └────┬──────┘     └──┬──────┘
        │                │                │
        └────────────────┼────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
    ┌───▼─────────────┐      ┌──────────▼───┐
    │ SHARED LAYER    │      │  CORE LAYER  │
    │                 │      │              │
    │ Components:     │      │ Services:    │
    │ - kpi-card      │      │ - forecast.s │
    │ - summary-card  │      │ - spending.s │
    │ - header        │      │ - dashboard.s│
    │ - loading-spin  │      │              │
    │ - error-alert   │      │ Models:      │
    │                 │      │ - forecast.m │
    │ Services:       │      │ - spending.m │
    │ - chart.s       │      │ - dashboard.m│
    │ - notification.s│      │              │
    │ - format.s      │      │              │
    └─────────────────┘      └──────────────┘
                │                   │
                └───────────┬───────┘
                            │
                ┌───────────▼────────────┐
                │   HTTP CLIENT          │
                │ (Angular HttpClient)   │
                └───────────┬────────────┘
                            │
                    HTTP (JSON Requests)
                            │
        ┌───────────────────┼──────────────────┐
        │                   │                  │
    ┌───▼──────┐      ┌─────▼────┐      ┌────▼──────┐
    │ GET /api/│      │ GET /api/ │      │ GET /api/ │
    │forecasts │      │ spending  │      │dashboard  │
    │          │      │           │      │           │
    │ POST/PUT │      │ POST/PUT  │      │ TREND/KPI │
    │ DELETE   │      │ DELETE    │      │           │
    └────┬─────┘      └─────┬─────┘      └────┬──────┘
         │                  │                 │
         └──────────────────┼─────────────────┘
                            │
        ┌───────────────────▼──────────────────┐
        │      SPRING BOOT BACKEND             │
        │       (localhost:8080)               │
        │                                      │
        │ Controllers:                         │
        │ - ForecastController                 │
        │ - SpendingController ← NEW           │
        │ - DashboardController ← NEW          │
        │                                      │
        │ Services:                            │
        │ - ForecastService                    │
        │ - SpendingService ← NEW              │
        │ - DashboardService ← NEW             │
        │                                      │
        │ Repositories:                        │
        │ - ForecastRepository                 │
        │ - SpendingRepository ← NEW           │
        │                                      │
        │ Entities:                            │
        │ - Forecast                           │
        │ - Spending ← NEW                     │
        │                                      │
        │ Database:                            │
        │ - H2 (in-memory)                     │
        │   - forecast table                   │
        │   - spending table ← NEW             │
        │                                      │
        └──────────────────────────────────────┘
```

## Data Flow Example: User Views Dashboard

```
1. USER ACTION
   └─ Opens browser → localhost:4200

2. ROUTING
   └─ app.routes.ts → /home (default route)
   └─ Loads: HOME_ROUTES from home-routing.module.ts

3. HOME FEATURE LOADS
   └─ home-page.component loads
      └─ Injects: DashboardService, HomeService
      └─ Calls: dashboardService.getTrendData()

4. HTTP REQUEST
   └─ HttpClient sends: GET /api/dashboard/trend
   └─ DashboardService (core/services) handles request

5. BACKEND PROCESSES
   └─ DashboardController receives request
   └─ Calls: DashboardService (backend)
   └─ Queries: Database
   └─ Returns: { trends: [...], kpis: [...] }

6. RESPONSE RECEIVED
   └─ home-page.component receives data
   └─ Passes to child components:
      └─ trend-chart.component
         └─ Uses: ChartService (shared/services)
         └─ Injects: chart data
         └─ Displays: Chart visualization
      │
      └─ kpi-section.component
         └─ Uses: KpiCardComponent (shared/components)
         └─ Passes: [{ title, value, trend }]
         └─ Displays: KPI cards

7. RENDERING
   └─ Angular renders template
   └─ User sees dashboard with:
      ├─ Trend chart
      ├─ KPI cards
      └─ Loading spinner (while fetching)

8. INTERACTION
   └─ User clicks on filter
   └─ Feature requests new data
   └─ Cycle repeats from step 3
```

## Component Reusability Example

```
SHARED COMPONENT: kpi-card.component

Usage 1: Home Feature
└─ home/components/kpi-section/kpi-section.component.html
   <app-kpi-card
     [title]="'Total Revenue'"
     [value]="123456"
     [icon]="'trending_up'">
   </app-kpi-card>

Usage 2: Dashboard Feature
└─ dashboard/components/dashboard.component.html
   <app-kpi-card
     [title]="'Forecast Revenue'"
     [value]="987654"
     [icon]="'trending_down'">
   </app-kpi-card>

Usage 3: Spending Feature
└─ spending/components/department-summary/department-summary.component.html
   <app-kpi-card
     *ngFor="let dept of departments"
     [title]="dept.name"
     [value]="dept.spending"
     [icon]="'money'">
   </app-kpi-card>

KEY BENEFIT:
✅ One component definition
✅ Three different features use it
✅ No duplication
✅ Easy to maintain (fix one place, updates everywhere)
```

## Service Usage Example

```
SHARED SERVICE: chart.service

Feature 1: Home Dashboard
└─ home/components/trend-chart/trend-chart.component.ts
   constructor(private chartService: ChartService) {}
   ngOnInit() {
     this.chartData = this.chartService.generateTrendChart(this.forecasts);
   }

Feature 2: Spending Chart
└─ spending/components/spending-chart/spending-chart.component.ts
   constructor(private chartService: ChartService) {}
   ngOnInit() {
     this.chartData = this.chartService.generateSpendingChart(this.spendings);
   }

Feature 3: Forecast Analytics
└─ forecast/components/forecast-analytics/forecast-analytics.component.ts
   constructor(private chartService: ChartService) {}
   ngOnInit() {
     this.chartData = this.chartService.generateMonthlyChart(this.forecasts);
   }

KEY BENEFIT:
✅ Chart generation logic centralized
✅ All features use consistent charts
✅ Update chart rendering: edit 1 service (affects all features)
✅ Reduced code duplication
```

## Feature Module Independence

```
Each feature is independent and loadable:

Home Feature:
- Lazy loaded at /home
- Uses: shared components, core services
- Independent routing: home-routing.module.ts
- Can be removed without affecting others

Forecast Feature:
- Lazy loaded at /forecasts
- Uses: shared components, core services
- Independent routing: finance-forecast-routing.module.ts
- Can be removed without affecting others

Spending Feature:
- Lazy loaded at /spending
- Uses: shared components, core services
- Independent routing: spending-forecast-routing.module.ts
- Can be removed without affecting others

BENEFITS:
✅ Modular development
✅ Team members can work on separate features
✅ Easy to test features independently
✅ Easy to add/remove features
✅ Reduced bundle size (lazy loading)
```

## Dependency Direction

```
GOOD (Dependency flows DOWN):

app.routes.ts (root)
    ↓
features/home/
features/finance-forecast/
features/spending-forecast/
    ↓
shared/ + core/
    ↓
Angular Framework + HTTP

KEY RULE:
✅ Features import from shared & core
✅ Shared NEVER imports from features
✅ Core NEVER imports from features

This is called "Dependency Inversion Principle" in SOLID

BAD (Circular dependencies):
features/home/ imports from features/spending/ ❌ WRONG!
shared/services/ imports from features/dashboard/ ❌ WRONG!
```

## Summary

```
┌─────────────────────────────────────────┐
│  HIERARCHICAL MVC ARCHITECTURE          │
├─────────────────────────────────────────┤
│                                         │
│  Layer 1: Shared (Reusable)            │
│  ├─ Components (UI building blocks)    │
│  ├─ Services (Utilities)               │
│  └─ Models (Types)                     │
│                                         │
│  Layer 2: Core (Business Logic)        │
│  ├─ Services (API calls)               │
│  └─ Models (Data types)                │
│                                         │
│  Layer 3: Features (Isolated)          │
│  ├─ Home (Dashboard)                   │
│  ├─ Finance Forecast (CRUD)            │
│  └─ Spending Forecast (Analysis)       │
│                                         │
│  Layer 4: Root (Configuration)         │
│  ├─ Routing                            │
│  ├─ Providers                          │
│  └─ Bootstrap                          │
│                                         │
└─────────────────────────────────────────┘

CHARACTERISTICS:
✅ Clear separation of concerns
✅ Reusable components & services
✅ Lazy-loaded features
✅ Scalable structure
✅ Team-friendly organization
✅ Easy to maintain & test
✅ Industry standard pattern
```
