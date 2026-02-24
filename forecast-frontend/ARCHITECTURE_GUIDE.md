# HIERARCHICAL MVC ARCHITECTURE IMPLEMENTATION GUIDE

## Project Structure Overview

```
forecast-frontend/src/app/
├── shared/
│   ├── components/
│   │   ├── kpi-card/
│   │   ├── summary-card/
│   │   ├── header/
│   │   ├── loading-spinner/
│   │   └── error-alert/
│   ├── services/
│   │   ├── chart.service.ts
│   │   ├── notification.service.ts
│   │   └── format.service.ts
│   └── models/
│       └── chart.model.ts
│
├── core/
│   ├── services/
│   │   ├── forecast.service.ts
│   │   ├── spending.service.ts
│   │   └── dashboard.service.ts
│   └── models/
│       ├── forecast.model.ts
│       ├── spending.model.ts
│       └── dashboard.model.ts
│
├── features/
│   ├── home/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   ├── trend-chart/
│   │   │   └── kpi-section/
│   │   ├── pages/
│   │   │   └── home-page/
│   │   ├── services/
│   │   │   └── home.service.ts
│   │   └── home-routing.module.ts
│   │
│   ├── finance-forecast/
│   │   ├── components/
│   │   │   ├── forecast-list/
│   │   │   ├── forecast-form/
│   │   │   ├── forecast-delete/
│   │   │   └── forecast-filter/
│   │   ├── pages/
│   │   │   └── forecast-page/
│   │   └── finance-forecast-routing.module.ts
│   │
│   └── spending-forecast/
│       ├── components/
│       │   ├── spending-table/
│       │   ├── spending-filter/
│       │   ├── spending-chart/
│       │   └── department-summary/
│       ├── pages/
│       │   └── spending-page/
│       ├── services/
│       │   └── spending-feature.service.ts
│       └── spending-forecast-routing.module.ts
│
├── app.component.ts
├── app.component.html
├── app.component.scss
├── app.routes.ts
├── app.config.ts
└── styles.scss
```

## Component File Structure

Each component should have 3 files:

```
component-name/
├─ component-name.component.ts      (TypeScript - Logic)
├─ component-name.component.html    (HTML - Template)
└─ component-name.component.scss    (CSS - Styles)
```

## Shared Components Usage Pattern

### DO:
```typescript
// feature/components/child.component.ts
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card.component';

@Component({
  selector: 'app-child',
  imports: [CommonModule, KpiCardComponent], // Import from shared!
  templateUrl: './child.component.html'
})
export class ChildComponent {}
```

### DON'T:
```typescript
// ❌ Don't duplicate shared components in features
feature/components/
├─ kpi-card/  // DUPLICATE!
feature2/components/
├─ kpi-card/  // DUPLICATE!
```

## Service Hierarchy

- **shared/services/** - Utility services used by all features (ChartService, NotificationService)
- **core/services/** - API services (ForecastService, SpendingService)
- **features/*/services/** - Feature-specific services (optional, if needed)

## Implementation Steps

1. Create shared components
2. Create shared services
3. Create core services and models
4. Create feature modules
5. Set up routing
6. Test everything

## Backend Requirements

Ensure these endpoints exist:

```
GET    /api/forecasts?page=0&size=10&filters...     (existing)
GET    /api/forecasts/{id}                          (existing)
POST   /api/forecasts                               (existing)
PUT    /api/forecasts/{id}                          (existing)
DELETE /api/forecasts/{id}                          (existing)

GET    /api/spending?page=0&size=10&filters...      (NEW)
GET    /api/spending/{id}                           (NEW)
POST   /api/spending                                (NEW)
PUT    /api/spending/{id}                           (NEW)
DELETE /api/spending/{id}                           (NEW)
GET    /api/spending/summary?year=2024              (NEW)

GET    /api/dashboard/trend                         (NEW)
GET    /api/dashboard/kpi                           (NEW)
```
