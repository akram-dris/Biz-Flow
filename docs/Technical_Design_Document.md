# Technical Design Document (TDD) - BizFlow

## 1. System Overview
BizFlow is a full-stack business management platform following a client-server architecture. The frontend (React/Vite) communicates with the backend (NestJS) via RESTful APIs, and the backend persists data in PostgreSQL.

### High-Level Architecture
```
┌─────────────────────┐         ┌─────────────────────┐         ┌──────────────────┐
│   React Frontend    │ ──────> │   NestJS Backend    │ ──────> │   PostgreSQL     │
│   (Nginx)           │ <────── │   (REST API)        │ <────── │   Database       │
└─────────────────────┘         └─────────────────────┘         └──────────────────┘
     Port 80                         Port 3000                      Port 5432
     
     - UI Components                 - Controllers                - Business Data
     - State Management              - Services                   - Relationships
     - HTTP Client                   - Modules                    - Transactions
```

---

## 2. Technology Stack

### Frontend
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | React | 19.2.0 | UI library |
| Build Tool | Vite | 7.2.4 | Fast dev server & build |
| Language | TypeScript | 5.9.3 | Type safety |
| Styling | Tailwind CSS | 4.1.17 | Utility-first CSS |
| UI Components | Radix UI | Latest | Accessible primitives |
| Icons | Lucide React | 0.555.0 | Icon library |
| Utilities | clsx, tailwind-merge | Latest | Class name management |
| Routing | React Router v6 | TBD | Client-side routing |
| State Management | React Query + Context | TBD | Server state & global state |
| HTTP Client | Axios / Fetch | TBD | API communication |
| Forms | React Hook Form | TBD | Form handling & validation |

### Backend
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | NestJS | 11.0.1 | Node.js framework |
| Language | TypeScript | 5.7.3 | Type safety |
| Runtime | Node.js | 18+ | JavaScript runtime |
| Web Server | Express | Latest | HTTP server |
| Testing | Jest | 30.0.0 | Unit & integration tests |
| ORM | Prisma | Latest | Type-safe database access |
| Authentication | Passport + JWT | TBD | User authentication |
| Validation | class-validator | TBD | DTO validation |
| Documentation | Swagger/OpenAPI | TBD | API documentation |

### Database
- **Database:** PostgreSQL 18
- **ORM:** Prisma (type-safe queries, auto-generated types)
- **Migrations:** Prisma Migrate
- **Studio:** Prisma Studio for visual database management

---

## 3. System Architecture

### 3.1 Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI (Button, Input, Modal)
│   │   ├── layout/          # Layout components (Navbar, Sidebar)
│   │   └── modules/         # Module-specific components
│   ├── pages/
│   │   ├── dashboard/
│   │   ├── crm/
│   │   ├── sales/
│   │   ├── inventory/
│   │   ├── projects/
│   │   ├── hr/
│   │   └── accounting/
│   ├── services/            # API service layer
│   │   └── api.ts           # HTTP client instance & interceptors
│   ├── hooks/               # Custom React hooks
│   ├── context/             # React Context (Auth, Theme)
│   ├── types/               # TypeScript interfaces
│   ├── lib/                 # Utility functions
│   ├── assets/              # Static assets
│   ├── App.tsx              # Root component
│   ├── App.css              # Global styles
│   ├── index.css            # Base CSS
│   └── main.tsx             # Application entry point
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json
```

**Key Configuration:**
- Path alias `@/*` maps to `./src/*` for clean imports
- Tailwind CSS v4 with Vite plugin for styling
- TypeScript compilation with strict mode

### 3.2 Backend Structure
```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/            # Authentication & authorization
│   │   ├── users/           # User management
│   │   ├── crm/             # Contacts, leads, activities
│   │   ├── sales/           # Quotes, invoices, payments
│   │   ├── inventory/       # Products, stock movements
│   │   ├── projects/        # Projects, tasks, time entries
│   │   ├── hr/              # Employees, departments
│   │   └── accounting/      # Expenses, accounts
│   ├── common/
│   │   ├── guards/          # AuthGuard, RolesGuard
│   │   ├── decorators/      # Custom decorators
│   │   ├── filters/         # Exception filters
│   │   └── interceptors/    # Response transformation
│   ├── config/              # Configuration (database, JWT)
│   ├── app.module.ts        # Root module
│   ├── app.controller.ts    # Root controller
│   ├── app.service.ts       # Root service
│   └── main.ts              # Application bootstrap
├── test/                    # E2E tests
├── tsconfig.json            # TypeScript configuration
├── nest-cli.json            # NestJS CLI configuration
└── package.json
```

**Key Configuration:**
- Global API prefix: `/api`
- CORS enabled for frontend origin: `http://localhost:5173`
- Port: 3000 (configurable via environment variable)

---

## 4. Module Architecture

### 4.1 Core Modules

#### Authentication Module
- User registration and login
- JWT-based authentication
- Role-based access control (Owner, Manager, Employee)
- Password reset functionality

#### Dashboard Module
- Business metrics overview
- Quick stats and KPIs
- Recent activities feed
- Customizable widgets

#### CRM Module
- Contact management (customers/suppliers)
- Lead tracking and pipeline management
- Activity logging (calls, meetings, emails)
- Contact history and interactions

#### Sales Module
- Quote creation and management
- Invoice generation and tracking
- Payment recording
- PDF generation for quotes/invoices

#### Inventory Module
- Product catalog management
- Stock level tracking
- Stock movement recording
- Low stock alerts

#### Projects Module
- Project creation and management
- Task assignment and tracking
- Time logging and tracking
- Project progress visualization

#### HR Module
- Employee directory
- Department management
- Employee information management

#### Accounting Module
- Expense tracking and categorization
- Revenue tracking (from invoices)
- Profit & Loss reporting
- Expense categories management

---

## 5. Security Implementation

### 5.1 Authentication & Authorization
- **JWT-based Authentication:** Access tokens with configurable expiry
- **Role-Based Access Control (RBAC):** Three roles: Owner, Manager, Employee
- **Password Security:** Bcrypt hashing with salt
- **Session Management:** Secure token storage and refresh mechanism

### 5.2 Data Protection
- **HTTPS/TLS:** Enforce encrypted connections in production
- **CORS Configuration:** Whitelist trusted origins only
- **Input Validation:** Server-side validation using class-validator
- **SQL Injection Prevention:** ORM-based queries with parameterization
- **XSS Protection:** Content Security Policy headers

### 5.3 API Security
- Protected endpoints require valid JWT token
- Role-based endpoint access control
- Rate limiting (to be implemented)
- Request size limits

---

## 6. Development Workflow

### 6.1 Local Setup

**Prerequisites:**
- Node.js 18+
- PostgreSQL 18
- npm or yarn

**Backend Setup:**
```bash
cd backend
npm install
npm run start:dev  # Starts on port 3000
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm run dev  # Starts on port 5173
```

### 6.2 Environment Variables

**Backend `.env`:**
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/bizflow
JWT_SECRET=your-super-secret-key
JWT_EXPIRATION=15m
REFRESH_TOKEN_EXPIRATION=7d
PORT=3000
```

**Frontend `.env`:**
```bash
VITE_API_URL=http://localhost:3000/api
```

### 6.3 Build Commands

**Frontend:**
```bash
npm run build      # TypeScript compilation + Vite build
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

**Backend:**
```bash
npm run build      # NestJS build
npm run start:prod # Start production server
npm run test       # Run tests
npm run test:e2e   # Run E2E tests
```

---

## 7. Deployment Architecture

### 7.1 Docker Containerization
BizFlow is deployed using Docker containers with three separate services:

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Compose                       │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Frontend   │  │   Backend    │  │  PostgreSQL  │ │
│  │   Container  │  │   Container  │  │   Container  │ │
│  │              │  │              │  │              │ │
│  │  React 19    │  │  NestJS 11   │  │  Postgres 18 │ │
│  │  Vite Build  │  │  Node.js 18  │  │              │ │
│  │  Port: 80    │  │  Port: 3000  │  │  Port: 5432  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│         │                 │                  │          │
│         └─────────────────┴──────────────────┘          │
│                    Docker Network                       │
└─────────────────────────────────────────────────────────┘
```

### 7.2 Docker Images

#### Frontend Image
```dockerfile
# Dockerfile.frontend
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Backend Image
```dockerfile
# Dockerfile.backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

#### Database Image
```yaml
# Uses official PostgreSQL 18 image
image: postgres:18-alpine
```

### 7.3 Docker Compose Configuration
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - bizflow-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://bizflow:password@database:5432/bizflow
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - database
    networks:
      - bizflow-network

  database:
    image: postgres:18-alpine
    environment:
      - POSTGRES_USER=bizflow
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=bizflow
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - bizflow-network

volumes:
  postgres-data:

networks:
  bizflow-network:
    driver: bridge
```

### 7.4 Deployment Commands
```bash
# Build and start all containers
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop all containers
docker-compose down

# Stop and remove volumes (clean database)
docker-compose down -v
```

---

## 8. Performance Considerations

### 9.1 Frontend Optimization
- Code splitting and lazy loading for routes/modules
- Image optimization with modern formats (WebP)
- Bundle size optimization with tree-shaking
- React Query for efficient data caching

### 9.2 Backend Optimization
- Database query optimization with proper indexing
- Pagination for large datasets (default: 50 items/page)
- Connection pooling for database connections
- Caching strategy (Redis in Phase 2)

### 9.3 Database Optimization
- Indexes on foreign keys and frequently queried fields
- Proper use of database transactions
- Query optimization and N+1 prevention

---

## 9. Monitoring & Logging

### 10.1 Application Monitoring
- Error tracking and logging
- Performance monitoring
- Uptime monitoring
- User analytics

### 10.2 Database Monitoring
- Query performance tracking
- Connection pool monitoring
- Automated backups (daily)


