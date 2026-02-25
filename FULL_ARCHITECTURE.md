# Forecast Application - Architecture with File Structure

## System Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         DEPLOYMENT ARCHITECTURE                              │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  GitHub Repository                                                           │
│  └── Forecast (Main Branch)                                                  │
│      ├── Auto-triggers Netlify build on push                                │
│      └── Auto-triggers Render build on push                                 │
│                                                                               │
│  ┌─────────────────────────────┐    ┌─────────────────────────────┐         │
│  │   NETLIFY (Frontend)        │    │   RENDER (Backend)          │         │
│  │ quiet-crisp-081075.netlify  │    │ forecast-1-tpoj.onrender    │         │
│  │ .app                        │    │ .com                        │         │
│  └─────────────────────────────┘    └─────────────────────────────┘         │
│           ↕ HTTPS (REST API)                  ↕ JDBC                        │
│  ┌─────────────────────────────┐    ┌─────────────────────────────┐         │
│  │  Angular SPA (Frontend)     │    │  Spring Boot (Backend)      │         │
│  │  Served as static files     │    │  Java Web Service           │         │
│  └─────────────────────────────┘    └─────────────────────────────┘         │
│                                             ↕                               │
│                                      ┌─────────────────┐                   │
│                                      │  H2 Database    │                   │
│                                      │  (In-memory)    │                   │
│                                      └─────────────────┘                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Frontend File Structure (Angular)

```
forecast-frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts           [JWT authentication]
│   │   │   │   ├── forecast.service.ts       [Forecast CRUD]
│   │   │   │   ├── dashboard.service.ts      [KPI calculations]
│   │   │   │   └── expense.service.ts        [Expense CRUD]
│   │   │   ├── interceptors/
│   │   │   │   └── jwt.interceptor.ts        [Add JWT to headers]
│   │   │   └── models/
│   │   │       ├── forecast.model.ts
│   │   │       ├── expense.model.ts
│   │   │       └── user.model.ts
│   │   │
│   │   ├── features/
│   │   │   ├── dashboard/
│   │   │   │   ├── dashboard.component.ts    [KPI Dashboard]
│   │   │   │   └── dashboard.component.scss
│   │   │   │
│   │   │   ├── forecast-page.component.ts    [Forecast CRUD Table]
│   │   │   ├── forecast-page.component.scss
│   │   │   │
│   │   │   ├── expenses-page.component.ts    [Expenses CRUD Table]
│   │   │   ├── expenses-page.component.scss
│   │   │   │
│   │   │   ├── home.component.ts             [Home Page]
│   │   │   ├── layout.component.ts           [Main Layout]
│   │   │   ├── sidenav.component.ts          [Sidebar Navigation]
│   │   │   │
│   │   │   ├── login.component.ts            [Login Page]
│   │   │   └── register.component.ts         [Registration Page]
│   │   │
│   │   ├── app.config.ts                     [HTTP Client config]
│   │   ├── app.routes.ts                     [Route definitions]
│   │   └── app.component.ts                  [Root component]
│   │
│   ├── index.html                            [Main HTML entry]
│   ├── main.ts                               [Bootstrap]
│   └── styles.scss                           [Global styles]
│
├── dist/
│   └── forecast-frontend/
│       ├── browser/
│       │   ├── index.html                    [Built entry]
│       │   ├── main-XXXXX.js                 [Bundled Angular app]
│       │   ├── styles-XXXXX.css              [Bundled styles]
│       │   └── ...other assets...
│       └── server/
│
├── angular.json                              [Angular config]
├── tsconfig.json                             [TypeScript config]
├── package.json                              [NPM dependencies]
└── netlify.toml                              [Netlify deploy config]
```

## Backend File Structure (Spring Boot)

```
src/main/java/com/forecast/
├── ForecastApplication.java                 [Spring Boot entry point]
│
├── config/
│   ├── CorsConfig.java                      [CORS configuration]
│   ├── SecurityConfig.java                  [JWT security setup]
│   └── JwtProvider.java                     [JWT token generation]
│
├── controller/
│   ├── AuthController.java                  [/api/auth/login, /register]
│   ├── ForecastController.java              [/api/forecasts CRUD]
│   ├── ExpenseController.java               [/api/spending CRUD]
│   ├── DashboardController.java             [/api/dashboard KPIs]
│   └── DepartmentController.java            [/api/departments]
│
├── service/
│   ├── AuthService.java                     [Authentication logic]
│   ├── ForecastService.java                 [Forecast business logic]
│   ├── ExpenseService.java                  [Expense business logic]
│   ├── DashboardService.java                [KPI calculations]
│   └── DepartmentService.java               [Department operations]
│
├── repository/
│   ├── UserRepository.java                  [User JPA]
│   ├── ForecastRepository.java              [Forecast JPA]
│   ├── ExpenseRepository.java               [Expense JPA]
│   ├── DepartmentRepository.java            [Department JPA]
│   └── CustomRepository.java                [Custom queries]
│
├── entity/
│   ├── User.java                            [User entity]
│   ├── Forecast.java                        [Forecast entity]
│   ├── Expense.java                         [Expense entity]
│   └── Department.java                      [Department entity]
│
├── dto/
│   ├── ForecastDTO.java                     [Forecast data transfer]
│   ├── ExpenseDTO.java                      [Expense data transfer]
│   ├── LoginRequest.java                    [Login request DTO]
│   ├── LoginResponse.java                   [Login response DTO]
│   └── DashboardDTO.java                    [Dashboard KPI DTO]
│
├── mapper/
│   ├── ForecastMapper.java                  [Entity ↔ DTO mapping]
│   ├── ExpenseMapper.java
│   └── DepartmentMapper.java
│
├── security/
│   ├── JwtAuthenticationFilter.java         [JWT validation filter]
│   ├── CustomUserDetailsService.java        [User details service]
│   └── JwtUtil.java                         [JWT utilities]
│
├── exception/
│   ├── AuthenticationException.java         [Custom exceptions]
│   ├── ResourceNotFoundException.java
│   └── GlobalExceptionHandler.java          [Exception handling]
│
└── data/
    └── DataInitializer.java                 [Test data initialization]

src/main/resources/
├── application.properties                   [Spring config]
├── schema.sql                               [Database schema]
└── data.sql                                 [Test data]

pom.xml                                      [Maven dependencies]
Dockerfile                                   [Docker build config]
render.yaml                                  [Render deploy config]
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER INTERACTION                             │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│        FRONTEND (Angular - Browser)                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 1. Login Component                                       │  │
│  │    └→ AuthService.login(username, password)             │  │
│  │       └→ POST /api/auth/login                           │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                    ↓ HTTPS (REST API)
                 JWT in Authorization Header
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│        BACKEND (Spring Boot - Server)                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 2. AuthController.login()                               │  │
│  │    ├→ AuthService.authenticate()                        │  │
│  │    ├→ UserRepository.findByUsername()                   │  │
│  │    ├→ PasswordEncoder.matches()                         │  │
│  │    └→ JwtProvider.generateToken()                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 3. Authenticated Requests (with JWT)                    │  │
│  │    ├→ JwtAuthenticationFilter validates token           │  │
│  │    ├→ ForecastController.getForecasts()                 │  │
│  │    ├→ ForecastService (business logic)                  │  │
│  │    └→ ForecastRepository (queries data)                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                           ↓ JDBC SQL
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│        DATABASE (H2 / Embedded)                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Tables:                                                  │  │
│  │ ├─ users (id, username, password_hash, role)            │  │
│  │ ├─ forecasts (id, dept, category, year, month,          │  │
│  │ │             revenue, expense, scenario)               │  │
│  │ ├─ spending (id, dept, category, year, month, amount)   │  │
│  │ └─ departments (id, name)                               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                           ↓
                    Return JSON Data
                           ↓
        Display in Material Tables (Frontend)
```

## API Endpoints

```
Authentication:
  POST   /api/auth/login                [LoginRequest → JWT token]
  POST   /api/auth/register             [RegisterRequest → User]

Forecasts:
  GET    /api/forecasts                 [Paginated with filters]
  POST   /api/forecasts                 [Create new forecast]
  PUT    /api/forecasts/{id}            [Update forecast]
  DELETE /api/forecasts/{id}            [Delete forecast]

Expenses:
  GET    /api/spending                  [Paginated with filters]
  POST   /api/spending                  [Create new expense]
  PUT    /api/spending/{id}             [Update expense]
  DELETE /api/spending/{id}             [Delete expense]

Dashboard:
  GET    /api/dashboard/overview        [KPI data]
  GET    /api/dashboard/kpi-values      [KPI values]
  GET    /api/dashboard/department-perf [Department performance]
```

## Technology Stack

**Frontend:**
- Angular 17+
- TypeScript
- RxJS (Reactive)
- Angular Material (UI)
- Netlify (Hosting)

**Backend:**
- Spring Boot 3+
- Spring Security
- Spring Data JPA
- H2 Database
- JWT Authentication
- Render (Hosting)

**DevOps:**
- GitHub (Version Control)
- Docker (Containerization)
- netlify.toml (Frontend Deploy)
- render.yaml (Backend Deploy)
