# Forecast Application

A full-stack financial forecasting and expense tracking system built with Angular and Spring Boot.

## 🎯 Project Overview

The Forecast Application is a comprehensive financial management system that allows users to:
- **Track Forecasts:** Monitor revenue, expenses, and profit across departments and scenarios
- **Manage Expenses:** Record and categorize spending by department and category
- **View KPIs:** Dashboard with key performance indicators (Revenue, Expenses, Profit, Margins)
- **Filter & Sort:** Advanced filtering and sorting capabilities on all data tables
- **Inline Editing:** Click-to-edit functionality for quick data updates
- **Secure Access:** JWT-based authentication with role-based access control

## 🚀 Live Application

- **Frontend:** https://quiet-crisp-081075.netlify.app
- **Backend API:** https://forecast-1-tpoj.onrender.com/api

## 🏗️ Architecture

### System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        FORECAST APPLICATION                              │
│                      Complete System Architecture                         │
└──────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (Presentation)                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    WEB BROWSER                                  │  │
│  │              https://quiet-crisp-081075.netlify.app            │  │
│  │                                                                  │  │
│  │  ┌────────────────────────────────────────────────────────┐   │  │
│  │  │        ANGULAR 17+ SINGLE PAGE APPLICATION             │   │  │
│  │  │                                                         │   │  │
│  │  │  Components:                                           │   │  │
│  │  │  ├── Login / Register (Authentication)                │   │  │
│  │  │  ├── Dashboard (KPIs, Overview)                       │   │  │
│  │  │  ├── Forecast Table (CRUD, Sort, Filter)             │   │  │
│  │  │  ├── Expenses Table (CRUD, Sort, Filter)             │   │  │
│  │  │  └── Layout (Navigation, Sidebar)                    │   │  │
│  │  │                                                         │   │  │
│  │  │  Modules:                                              │   │  │
│  │  │  ├── Services (Auth, Forecast, Dashboard)            │   │  │
│  │  │  ├── Interceptors (JWT Authentication)               │   │  │
│  │  │  ├── Material Design UI                              │   │  │
│  │  │  └── RxJS (State Management)                         │   │  │
│  │  │                                                         │   │  │
│  │  └────────────────────────────────────────────────────────┘   │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                    ↕ HTTPS (REST API with JWT)
                    ↕ JSON Request/Response
┌─────────────────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER (Business Logic)                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │            SPRING BOOT MICROSERVICE                             │  │
│  │         https://forecast-1-tpoj.onrender.com/api               │  │
│  │                                                                  │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │ REST CONTROLLERS (API Endpoints)                        │  │  │
│  │  │ ├── AuthController (/auth/login, /register)            │  │  │
│  │  │ ├── ForecastController (/forecasts CRUD)               │  │  │
│  │  │ ├── ExpenseController (/spending CRUD)                 │  │  │
│  │  │ ├── DashboardController (/dashboard KPIs)              │  │  │
│  │  │ └── DepartmentController (/departments)                │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  │                          ↓                                      │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │ BUSINESS LOGIC LAYER (Services)                        │  │  │
│  │  │ ├── AuthService (JWT generation, validation)           │  │  │
│  │  │ ├── ForecastService (CRUD logic)                       │  │  │
│  │  │ ├── ExpenseService (CRUD logic)                        │  │  │
│  │  │ ├── DashboardService (KPI calculations)                │  │  │
│  │  │ └── DepartmentService (Operations)                     │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  │                          ↓                                      │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │ DATA LAYER (Repositories & Mappers)                    │  │  │
│  │  │ ├── UserRepository (JPA)                               │  │  │
│  │  │ ├── ForecastRepository (JPA)                           │  │  │
│  │  │ ├── ExpenseRepository (JPA)                            │  │  │
│  │  │ ├── DepartmentRepository (JPA)                         │  │  │
│  │  │ ├── Entity Mappers (DTO conversion)                    │  │  │
│  │  │ └── Custom Queries (Complex operations)                │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  │                          ↓                                      │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │ SECURITY LAYER                                         │  │  │
│  │  │ ├── JWT Authentication Filter                          │  │  │
│  │  │ ├── CORS Configuration                                 │  │  │
│  │  │ ├── Password Encoder (BCrypt)                          │  │  │
│  │  │ └── Authorization (Role-based)                         │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                         ↕ JDBC SQL Queries
┌─────────────────────────────────────────────────────────────────────────┐
│                       DATA LAYER (Persistence)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                  H2 DATABASE (Embedded)                         │  │
│  │                                                                  │  │
│  │  ┌──────────────────┐  ┌──────────────────┐                   │  │
│  │  │  USERS TABLE     │  │ FORECASTS TABLE  │                   │  │
│  │  ├──────────────────┤  ├──────────────────┤                   │  │
│  │  │ id               │  │ id               │                   │  │
│  │  │ username         │  │ department       │                   │  │
│  │  │ password_hash    │  │ category         │                   │  │
│  │  │ role             │  │ "year"           │                   │  │
│  │  │ email            │  │ "month"          │                   │  │
│  │  └──────────────────┘  │ revenue          │                   │  │
│  │                        │ expense          │                   │  │
│  │  ┌──────────────────┐  │ scenario         │                   │  │
│  │  │ EXPENSES TABLE   │  └──────────────────┘                   │  │
│  │  ├──────────────────┤                                          │  │
│  │  │ id               │  ┌──────────────────┐                   │  │
│  │  │ department       │  │ DEPARTMENTS TABL │                   │  │
│  │  │ category         │  ├──────────────────┤                   │  │
│  │  │ "year"           │  │ id               │                   │  │
│  │  │ "month"          │  │ name             │                   │  │
│  │  │ amount           │  └──────────────────┘                   │  │
│  │  └──────────────────┘                                          │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

See [FULL_ARCHITECTURE.md](./FULL_ARCHITECTURE.md) for detailed system architecture, file structure, and data flow diagrams.

### Architecture Type: 3-Tier Layered Architecture

This application follows a **3-Tier Layered Architecture** pattern combined with **REST API** and **Microservices** principles.

#### Why This Architecture?

**1. Separation of Concerns**
- **Frontend Layer:** Handles only UI/UX logic and user interactions
- **Application Layer:** Contains business logic, validation, and processing
- **Data Layer:** Manages database operations and persistence
- **Benefit:** Each layer can be developed, tested, and maintained independently

**2. Scalability**
- Layers can be scaled independently based on load
- Frontend can be served by a CDN (Netlify)
- Backend can be scaled horizontally with multiple instances
- Database can be optimized separately
- **Benefit:** Easier to handle growing users and data

**3. Reusability**
- Backend API can serve multiple frontends (web, mobile, desktop)
- Business logic in services can be reused across different endpoints
- **Benefit:** Reduced code duplication and faster development

**4. Maintainability**
- Clear structure makes code easier to understand
- Changes in one layer don't affect others
- Debugging is simplified (know exactly which layer has issues)
- **Benefit:** Faster bug fixes and feature additions

**5. Testability**
- Each layer can be unit tested independently
- Mocking is easier with service interfaces
- Integration tests can test layer interactions
- **Benefit:** Higher code quality and fewer production bugs

**6. Security**
- Security layer isolated at application level
- JWT authentication prevents unauthorized access
- SQL injection protection through JPA/Parameterized queries
- CORS prevents unauthorized frontend access
- **Benefit:** Robust protection against common attacks

**7. Flexibility**
- Easy to swap components (e.g., database from H2 to PostgreSQL)
- Can add caching layer (Redis) without changing core logic
- Can add API versioning for backward compatibility
- **Benefit:** Future-proof architecture

**8. Deployment Independence**
- Frontend and backend deployed separately
- Can update one without affecting the other
- Easier rollback if deployment fails
- **Benefit:** Reduced deployment risk and downtime

### Architecture Comparison

```
✅ CHOSEN: 3-Tier Layered + REST API
   Pros: Clear structure, scalable, maintainable, industry standard
   Cons: May be overkill for very simple apps

❌ Alternative: Monolithic
   Pros: Simple to start
   Cons: Hard to scale, everything tightly coupled

❌ Alternative: Full Microservices
   Pros: Maximum scalability
   Cons: Complex, expensive, overkill for this scale

❌ Alternative: Serverless
   Pros: No infrastructure management
   Cons: Vendor lock-in, cold start issues, not suitable for real-time data
```

### Data Flow Architecture

```
1. USER INTERACTION (Browser)
   ↓
2. ANGULAR COMPONENT (sends HTTP request with JWT token)
   ↓
3. FRONTEND SERVICE (AuthService, ForecastService, etc.)
   ↓
4. ANGULAR INTERCEPTOR (adds JWT Authorization header)
   ↓
5. HTTP REQUEST to REST API
   ↓
6. SPRING BOOT CONTROLLER (receives request)
   ↓
7. JWT FILTER (validates token)
   ↓
8. BUSINESS SERVICE (executes business logic)
   ↓
9. REPOSITORY (queries database)
   ↓
10. DATABASE (returns data)
   ↓
11. MAPPER (converts Entity to DTO)
   ↓
12. JSON RESPONSE (sends back to frontend)
   ↓
13. ANGULAR SERVICE (processes response)
   ↓
14. COMPONENT (renders data in Material table)
   ↓
15. USER SEES RESULT (updated UI)
```

### Technology Choices & Rationale

| Component | Choice | Why? |
|-----------|--------|------|
| Frontend Framework | Angular 17+ | Enterprise-grade, full-featured, type-safe |
| Frontend UI | Material Design | Professional look, accessibility, built-in components |
| Backend Framework | Spring Boot | Industry standard, mature, excellent ecosystem |
| Authentication | JWT | Stateless, scalable, works with microservices |
| Database | H2 (with PostgreSQL option) | Lightweight for dev, scalable for production |
| API Style | REST | Standard, easy to understand, widely adopted |
| Deployment | Netlify + Render | Easy CI/CD, free tier, auto-scaling |
| Containerization | Docker | Ensures consistency across environments |

**Architecture Type: 3-Tier Layered Architecture (Presentation → Business Logic → Data Access)**

```
Frontend (Netlify)          Backend (Render)        Database (H2)
┌──────────────────┐      ┌──────────────────┐    ┌──────────────┐
│  Angular 17+ SPA │◄────►│  Spring Boot API │◄──►│  H2 Database │
│  Material Design │      │  REST Endpoints  │    │  (Embedded)  │
└──────────────────┘      └──────────────────┘    └──────────────┘
```

## 📋 Features

### Frontend (Angular)
- ✅ Responsive Material Design UI
- ✅ JWT-based Authentication (Login/Register)
- ✅ Dashboard with KPI metrics
- ✅ Forecast management (CRUD operations)
- ✅ Expense tracking (CRUD operations)
- ✅ Advanced table features:
  - Sorting by column headers
  - Filtering by department, category, year, month
  - Pagination
  - Inline cell editing
  - Dialog-based full editing
- ✅ Real-time data synchronization
- ✅ Month display (Jan-Dec instead of numeric)
- ✅ Year dropdown filter

### Backend (Spring Boot)
- ✅ RESTful API endpoints
- ✅ Spring Security with JWT authentication
- ✅ CORS configuration for cross-origin requests
- ✅ JPA/Hibernate for database operations
- ✅ Input validation and error handling
- ✅ Role-based access control (Admin, Manager, Viewer)
- ✅ Database initialization with test data
- ✅ Reserved keyword handling (year, month fields)

### Database (H2)
- ✅ User management
- ✅ Forecast records (department, category, year, month, revenue, expense, scenario)
- ✅ Expense records (department, category, year, month, amount)
- ✅ Department master data

## 🛠️ Tech Stack

### Frontend
- **Framework:** Angular 17+
- **Language:** TypeScript
- **UI Library:** Angular Material
- **State Management:** RxJS (Reactive)
- **HTTP Client:** Angular HttpClient
- **Routing:** Angular Router
- **Build Tool:** Webpack (via Angular CLI)
- **Hosting:** Netlify

### Backend
- **Framework:** Spring Boot 3+
- **Language:** Java 17+
- **Database:** H2 (Embedded)
- **ORM:** Hibernate (JPA)
- **Security:** Spring Security + JWT
- **Build Tool:** Maven
- **Containerization:** Docker
- **Hosting:** Render

### DevOps
- **Version Control:** Git/GitHub
- **Frontend Deployment:** Netlify (auto-deploy on push)
- **Backend Deployment:** Render (Docker, auto-deploy on push)
- **CI/CD:** GitHub Actions

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ (for frontend)
- Java 17+ (for backend)
- Maven 3.8+ (for backend)
- Git

### Frontend Setup

```bash
cd forecast-frontend

# Install dependencies
npm install

# Development server
npm start
# Navigate to http://localhost:4200

# Build for production
npm run build
# Output in dist/forecast-frontend
```

### Backend Setup

```bash
# Navigate to project root
cd ..

# Build with Maven
mvn clean install

# Run the application
mvn spring-boot:run
# Server runs on http://localhost:8080
```

## 🔑 API Endpoints

### Authentication
```
POST   /api/auth/login              Login with username/password
POST   /api/auth/register           Create new user account
```

### Forecasts
```
GET    /api/forecasts               List all forecasts (paginated, filtered)
POST   /api/forecasts               Create new forecast
PUT    /api/forecasts/{id}          Update forecast
DELETE /api/forecasts/{id}          Delete forecast
```

### Expenses
```
GET    /api/spending                List all expenses (paginated, filtered)
POST   /api/spending                Create new expense
PUT    /api/spending/{id}           Update expense
DELETE /api/spending/{id}           Delete expense
```

### Dashboard
```
GET    /api/dashboard/overview      Get dashboard overview
GET    /api/dashboard/kpi-values    Get KPI metrics
```

## 👤 Test Credentials

Use these credentials to log in:

```
Admin Account:
  Username: admin
  Password: admin123

Manager Account:
  Username: manager
  Password: manager123

Viewer Account:
  Username: viewer
  Password: viewer123
```

## 📊 Database Schema

### Users Table
```
- id (Primary Key)
- username (Unique)
- password (Hashed with BCrypt)
- email
- role (ADMIN, MANAGER, VIEWER)
```

### Forecasts Table
```
- id (Primary Key)
- department
- category (CapEx, R&D, Marketing, Operations, Admin)
- year (Quoted column name)
- month (Quoted column name)
- revenue
- expense
- scenario (ACTUAL, BUDGET)
```

### Expenses Table
```
- id (Primary Key)
- department
- category (CapEx, R&D, Marketing, Operations, Admin)
- year (Quoted column name)
- month (Quoted column name)
- amount
```

### Departments Table
```
- id (Primary Key)
- name (Unique)
```

## 🔒 Security Features

- **JWT Authentication:** Stateless token-based authentication
- **Password Encoding:** BCrypt for secure password storage
- **CORS Protection:** Configured for frontend origin only
- **Input Validation:** Server-side validation on all endpoints
- **Authorization:** Role-based access control (RBAC)
- **HTTP Only Cookies:** JWT stored securely (localStorage for SPA)

## 🚀 Deployment

### Frontend (Netlify)
- Automatically deployed on push to `main` branch
- Build command: `cd forecast-frontend && npm install && npm run build`
- Publish directory: `forecast-frontend/dist/forecast-frontend/browser`
- SPA routing configured with `netlify.toml`

### Backend (Render)
- Automatically deployed on push to `main` branch
- Docker containerized
- Build command: Dockerfile (multi-stage build)
- Start command: `java -jar target/forecast-0.0.1-SNAPSHOT.jar`

## 📝 Configuration Files

### Frontend
- **angular.json:** Angular CLI configuration
- **tsconfig.json:** TypeScript compiler options
- **netlify.toml:** Netlify deployment config
- **package.json:** NPM dependencies

### Backend
- **pom.xml:** Maven dependencies and build config
- **application.properties:** Spring Boot configuration
- **Dockerfile:** Docker build instructions
- **render.yaml:** Render deployment config

## 🔄 Development Workflow

1. **Create feature branch:** `git checkout -b feature/your-feature`
2. **Make changes:** Update frontend/backend code
3. **Test locally:** Run dev servers and verify functionality
4. **Commit & push:** `git commit -m "message" && git push origin feature/your-feature`
5. **Create PR:** GitHub pull request for code review
6. **Merge to main:** After approval, merge to main branch
7. **Auto-deploy:** Netlify & Render automatically deploy changes

## 📖 File Structure

See [FULL_ARCHITECTURE.md](./FULL_ARCHITECTURE.md) for detailed file structure of:
- `forecast-frontend/` - Angular application
- `src/main/java/com/forecast/` - Spring Boot application
- Build and configuration files

## 🐛 Known Issues & Limitations

- H2 database is in-memory (data lost on restart)
- Currently single Spring Boot instance (no horizontal scaling)
- No real-time WebSocket support
- Limited to 1000 records per page

## 🎯 Future Enhancements

- [ ] Switch to PostgreSQL for production
- [ ] Add WebSocket for real-time updates
- [ ] Implement caching (Redis)
- [ ] Add advanced reporting/export (PDF, Excel)
- [ ] Mobile app version
- [ ] Two-factor authentication
- [ ] Audit logging for compliance

## 📚 Documentation

- **Full Architecture:** See [FULL_ARCHITECTURE.md](./FULL_ARCHITECTURE.md)
- **API Documentation:** Swagger UI at `/swagger-ui.html` (when enabled)
- **Component Documentation:** Check inline comments in source files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary and confidential.

## 👨‍💼 Contact & Support

For questions or issues, please contact the development team or create an issue in GitHub.

---

**Last Updated:** February 25, 2026
**Version:** 1.0.0
**Status:** Production Ready ✅
