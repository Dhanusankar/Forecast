# HIERARCHICAL MVC - STEP-BY-STEP IMPLEMENTATION

## STEP 1: Shared Components & Services Creation

### 1.1 Shared Components to Create:
```
shared/components/
├─ kpi-card/                    (Display KPI metrics)
├─ summary-card/                (Summary statistics)
├─ header/                       (Top navigation)
├─ loading-spinner/             (Loading indicator)
└─ error-alert/                 (Error messages)
```

### 1.2 Shared Services to Create:
```
shared/services/
├─ chart.service.ts             (Generate chart data)
├─ notification.service.ts      (Show snackbars/alerts)
└─ format.service.ts            (Format numbers/dates)
```

### 1.3 Shared Models:
```
shared/models/
└─ chart.model.ts               (Chart interfaces)
```

## STEP 2: Core Services & Models Setup

### 2.1 Core Services:
```
core/services/
├─ forecast.service.ts          (API: /api/forecasts)
├─ spending.service.ts          (API: /api/spending) - NEW
└─ dashboard.service.ts         (API: /api/dashboard) - NEW
```

### 2.2 Core Models:
```
core/models/
├─ forecast.model.ts            (Forecast interface)
├─ spending.model.ts            (Spending interface) - NEW
└─ dashboard.model.ts           (Dashboard interface) - NEW
```

## STEP 3: Features Setup

### 3.1 Home Feature:
```
features/home/
├─ components/
│  ├─ dashboard/                (Main dashboard view)
│  ├─ trend-chart/              (Chart visualization)
│  └─ kpi-section/              (KPI cards display - uses shared)
├─ pages/
│  └─ home-page/                (Container/Page component)
├─ services/
│  └─ home.service.ts           (Optional, feature-specific)
└─ home-routing.module.ts       (Feature routing)
```

### 3.2 Finance Forecast Feature:
```
features/finance-forecast/
├─ components/
│  ├─ forecast-list/            (Table with data)
│  ├─ forecast-form/            (Create/Edit dialog)
│  ├─ forecast-delete/          (Delete confirmation)
│  └─ forecast-filter/          (Filter controls)
├─ pages/
│  └─ forecast-page/            (Container/Page component)
└─ finance-forecast-routing.module.ts
```

### 3.3 Spending Forecast Feature (NEW):
```
features/spending-forecast/
├─ components/
│  ├─ spending-table/           (Table with data)
│  ├─ spending-filter/          (Filter controls)
│  ├─ spending-chart/           (Chart visualization)
│  └─ department-summary/       (Summary cards - uses shared)
├─ pages/
│  └─ spending-page/            (Container/Page component)
├─ services/
│  └─ spending-feature.service.ts (Optional)
└─ spending-forecast-routing.module.ts
```

## STEP 4: Routing Setup

### Root Level (app.routes.ts):
```typescript
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./features/home/home-routing.module').then(m => m.HOME_ROUTES) },
  { path: 'forecasts', loadChildren: () => import('./features/finance-forecast/finance-forecast-routing.module').then(m => m.FINANCE_FORECAST_ROUTES) },
  { path: 'spending', loadChildren: () => import('./features/spending-forecast/spending-forecast-routing.module').then(m => m.SPENDING_FORECAST_ROUTES) },
  { path: '**', redirectTo: 'home' }
];
```

### Feature Level:
Each feature has its own routing module (home-routing.module.ts, etc)

## STEP 5: Backend Requirements

### New Endpoints Needed:
```
GET    /api/spending                 (List with pagination & filters)
GET    /api/spending/{id}            (Get single)
POST   /api/spending                 (Create new)
PUT    /api/spending/{id}            (Update)
DELETE /api/spending/{id}            (Delete)
GET    /api/spending/summary?year=   (Department summary)
GET    /api/dashboard/trend          (Trend data)
GET    /api/dashboard/kpi            (KPI data)
```

### New Entities Needed:
```
Spending entity:
├─ id
├─ department
├─ year
├─ month
├─ amount
├─ category
└─ version (optimistic locking)
```

## IMPLEMENTATION ORDER

1. **CREATE SHARED COMPONENTS** (2 hours)
   - kpi-card.component
   - summary-card.component
   - header.component
   - loading-spinner.component
   - error-alert.component

2. **CREATE SHARED SERVICES** (1 hour)
   - chart.service
   - notification.service
   - format.service

3. **CREATE CORE LAYER** (1.5 hours)
   - Update forecast.service
   - Create spending.service
   - Create dashboard.service
   - Create models

4. **CREATE HOME FEATURE** (2 hours)
   - dashboard.component
   - trend-chart.component
   - kpi-section.component (uses shared kpi-card)
   - home-page.component
   - home-routing.module

5. **REFACTOR FINANCE FORECAST** (1.5 hours)
   - Split existing code into separate files
   - Create forecast-filter.component
   - Create forecast-page wrapper
   - Set up routing

6. **CREATE SPENDING FEATURE** (2 hours)
   - spending-table.component
   - spending-filter.component
   - spending-chart.component
   - department-summary.component (uses shared summary-card)
   - spending-page.component
   - spending-forecast-routing.module

7. **ROOT SETUP & CONFIGURATION** (1.5 hours)
   - Update app.component
   - Update app.routes
   - Update app.config
   - Install chart.js & ng2-charts

8. **BACKEND UPDATES** (3 hours)
   - Create Spending entity
   - Create SpendingService
   - Create SpendingController
   - Update DataInitializer
   - Test all endpoints

9. **TESTING** (2 hours)
   - Test routing
   - Test shared components
   - Test data flows
   - Test UI responsiveness

## Total Estimated Time: ~16 hours

## Key Points to Remember

✅ **SHARED LAYER** - No duplication
- All reusable components in shared/components/
- All utility services in shared/services/
- All features import from shared, never duplicate

✅ **CORE LAYER** - Business logic
- All API services here
- All models here
- Features inject and use, don't modify

✅ **FEATURE LAYER** - Business features
- Each feature is self-contained
- Can have feature-specific services if needed
- Imports from shared and core
- Never creates duplicate shared components

✅ **SEPARATE FILES** - Organization
- Each component: .ts, .html, .scss in separate files
- Clean, readable structure
- Easy to navigate

✅ **LAZY LOADING** - Performance
- Each feature module is lazy-loaded
- Better initial load time
- Modular code

## Next Steps

Once you confirm you're ready, I will:
1. Create all shared components (with templates & styles)
2. Create all shared services
3. Create core services and models
4. Create feature modules
5. Set up routing
6. Provide backend code for new entities

Ready to proceed? 🚀
