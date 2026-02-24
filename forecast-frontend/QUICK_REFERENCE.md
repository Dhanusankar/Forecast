# HIERARCHICAL MVC - QUICK REFERENCE CARD

## Folder Structure At A Glance

```
src/app/
├── shared/
│   ├── components/          (kpi-card, summary-card, header, etc)
│   ├── services/            (chart, notification, format)
│   └── models/              (chart interfaces)
│
├── core/
│   ├── services/            (forecast, spending, dashboard APIs)
│   └── models/              (forecast, spending, dashboard types)
│
├── features/
│   ├── home/                (Dashboard feature)
│   ├── finance-forecast/    (Forecast CRUD feature)
│   └── spending-forecast/   (Spending analysis feature)
│
├── app.component.*          (Root component)
├── app.routes.ts            (Main routing)
├── app.config.ts            (Providers)
└── styles.scss              (Global styles)
```

---

## Component File Pattern

```
component-name/
├─ component-name.component.ts      ← TypeScript (Logic)
├─ component-name.component.html    ← HTML (Template)
└─ component-name.component.scss    ← CSS (Styles)
```

---

## When to Use What

### Shared Components
✅ **kpi-card** - Display single metric (value + trend + icon)
✅ **summary-card** - Display summary statistics
✅ **header** - Top navigation bar
✅ **loading-spinner** - Show loading state
✅ **error-alert** - Show error message

### Shared Services
✅ **chart.service** - Generate chart data from any data source
✅ **notification.service** - Show snackbars/alerts
✅ **format.service** - Format numbers, dates, currencies

### Core Services
✅ **forecast.service** - GET /api/forecasts (+ CRUD)
✅ **spending.service** - GET /api/spending (+ CRUD)
✅ **dashboard.service** - GET /api/dashboard/trend, /kpi

---

## Component Types

### SMART Component (Container)
```typescript
// Features/pages/feature-page.component.ts
✅ Loads data from services
✅ Manages state with signals
✅ Passes data to child components
✅ Receives events from children
✅ Has business logic

Injects: Services
Uses: Presentational components
```

### DUMB Component (Presentational)
```typescript
// features/components/child.component.ts
✅ Receives data via @Input
✅ Emits events via @Output
✅ Only renders UI
✅ No services
✅ No side effects

Receives: @Input() data
Emits: @Output() events
Uses: Shared components
```

---

## Import Patterns

### ✅ DO THIS:
```typescript
// In feature component, import shared component
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card.component';

// In feature, inject core service
constructor(private forecastService: ForecastService) {}

// Import from core models
import { Forecast } from '../../../core/models/forecast.model';
```

### ❌ DON'T DO THIS:
```typescript
// Don't duplicate shared components
feature1/components/kpi-card/   ❌ WRONG

// Don't create shared services in features
feature1/services/chart.service.ts  ❌ WRONG

// Don't import from other features
import from 'features/other-feature/...'  ❌ WRONG
```

---

## Service Injection Patterns

### In Smart Component:
```typescript
constructor(
  private coreService: ForecastService,  // Core API service
  private sharedService: ChartService    // Shared utility service
) {}
```

### In Presentational Component:
```typescript
// Usually NO services, just @Input/@Output
@Input() data: any;
@Output() onAction = new EventEmitter<any>();
```

### In Shared Component:
```typescript
// NO services at all
// Only @Input/@Output and UI logic
@Input() title: string;
@Output() onClick = new EventEmitter<void>();
```

---

## Routing Quick Reference

### Root Routes (app.routes.ts):
```typescript
{
  path: 'home',
  loadChildren: () => import('./features/home/home-routing.module')
    .then(m => m.HOME_ROUTES)
}

{
  path: 'forecasts',
  loadChildren: () => import('./features/finance-forecast/finance-forecast-routing.module')
    .then(m => m.FINANCE_FORECAST_ROUTES)
}

{
  path: 'spending',
  loadChildren: () => import('./features/spending-forecast/spending-forecast-routing.module')
    .then(m => m.SPENDING_FORECAST_ROUTES)
}
```

### Feature Routes (feature-routing.module.ts):
```typescript
export const FEATURE_ROUTES: Routes = [
  {
    path: '',
    component: FeaturePageComponent
  }
];
```

---

## Data Flow Template

```
User clicks → Route changes → Feature loads → Page component injects service
↓
API call via service → Backend responds → Component receives data
↓
Component passes data to child components via @Input
↓
Child components display data
↓
User sees result
↓
User clicks button → Child emits @Output event
↓
Parent receives event → Updates data or calls service
↓
Cycle repeats
```

---

## Component Import Checklist

### Smart Component Template:
```typescript
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Import core services
import { ForecastService } from '../../../core/services/forecast.service';

// Import presentational child components
import { DashboardComponent } from '../components/dashboard/dashboard.component';

@Component({
  selector: 'app-page-name',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    DashboardComponent
  ],
  templateUrl: './page-name.component.html',
  styleUrls: ['./page-name.component.scss']
})
export class PageNameComponent implements OnInit {
  // Implementation
}
```

### Presentational Component Template:
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import shared components
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card.component';

@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [
    CommonModule,
    KpiCardComponent
  ],
  templateUrl: './component-name.component.html',
  styleUrls: ['./component-name.component.scss']
})
export class ComponentNameComponent {
  @Input() data: any;
  @Output() action = new EventEmitter<any>();
  
  // Implementation
}
```

### Shared Component Template:
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-shared-component',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './shared-component.component.html',
  styleUrls: ['./shared-component.component.scss']
})
export class SharedComponentComponent {
  @Input() title: string = '';
  @Input() value: any;
  @Output() click = new EventEmitter<void>();
  
  // NO services!
  // Only UI logic
}
```

---

## Common Mistakes to Avoid

| ❌ Mistake | ✅ Solution |
|-----------|-----------|
| Duplicate shared components in features | Create once in shared/, import everywhere |
| Services in presentational components | Only use @Input/@Output |
| Feature importing from other feature | Import from shared or core only |
| Creating shared services in features | Create in shared/services/ folder |
| Shared components using services | Pure UI components only, no services |
| Circular dependencies | Respect dependency direction (down) |
| No separation of smart/dumb | Clear container vs presentational |
| All logic in components | Move to services |
| No lazy loading | Use loadChildren in routes |
| Tight coupling | Use dependency injection |

---

## Useful Commands

```bash
# Install dependencies
npm install chart.js ng2-charts

# Serve frontend
ng serve

# Build
ng build

# Run tests
ng test

# Create component (generates 3 files)
ng generate component features/home/components/dashboard

# Create service
ng generate service core/services/dashboard

# Create module
ng generate module features/home/home
```

---

## File Naming Convention

```
kebab-case for filenames:
✅ kpi-card.component.ts
✅ forecast-list.component.html
✅ dashboard.component.scss
✅ chart.service.ts
✅ forecast.model.ts

PascalCase for class names:
✅ KpiCardComponent
✅ ForecastListComponent
✅ ChartService
✅ Forecast
```

---

## Performance Tips

✅ Use OnPush change detection (components)
✅ Lazy load features (routing)
✅ Unsubscribe from observables (ngOnDestroy)
✅ Use signals for state (vs BehaviorSubject)
✅ Separate large components (split into child components)
✅ Use trackBy in *ngFor
✅ Import only needed modules
✅ Cache API responses
✅ Virtual scroll for long lists

---

## Testing Structure

```
For each component, create:
- component.spec.ts  (unit tests)

For each service:
- service.spec.ts  (unit tests)

Test:
- Component rendering
- @Input/@Output
- User interactions
- Service calls
- Error handling
```

---

## Deployment Checklist

- [ ] No console errors
- [ ] All routes work
- [ ] All data loads correctly
- [ ] Shared components reused
- [ ] No code duplication
- [ ] Images optimized
- [ ] Bundle size reasonable
- [ ] Mobile responsive
- [ ] Performance good
- [ ] Documentation complete

---

## Version Control Tips

```bash
# Feature branch
git checkout -b feature/home-dashboard

# Commit messages
git commit -m "feat: add kpi-card shared component"
git commit -m "refactor: split forecast-list into separate files"
git commit -m "fix: fix chart rendering issue"

# Merge
git checkout main
git merge feature/home-dashboard
```

---

## Remember

```
┌─────────────────────────────────┐
│   SHARED LAYER                  │
│   (Reusable)                    │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   CORE LAYER                    │
│   (Business Logic)              │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   FEATURES LAYER                │
│   (Independent Modules)         │
└─────────────────────────────────┘

✅ One direction dependency
✅ No duplication
✅ Clear organization
✅ Scalable structure
✅ Team friendly
```

---

**You're all set! Start building! 🚀**
