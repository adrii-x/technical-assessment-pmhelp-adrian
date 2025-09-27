# MedPortal Backend API

A secure, scalable healthcare management system backend built with NestJS, TypeScript, and Prisma. This API provides comprehensive functionality for patient management, appointment scheduling, medical records, and healthcare analytics with enterprise-grade security and role-based access control.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Authentication & Authorization](#authentication--authorization)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Security](#security)
- [Testing](#testing)
- [Deployment](#deployment)
- [Performance](#performance)
- [Monitoring & Logging](#monitoring--logging)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

## Overview

MedPortal Backend is a comprehensive healthcare management API that serves three distinct user roles with specific permissions and capabilities:

- **Patients**: Manage appointments, view medical records, handle subscriptions
- **Doctors**: Patient management, appointment scheduling, medical record creation, analytics
- **Administrators**: System oversight, user management, comprehensive analytics, settings

The system implements subscription-based appointment limits, comprehensive audit logging, and real-time analytics for healthcare providers.

## Features

### Core Features
- **JWT Authentication**: Secure token-based authentication with refresh capabilities
- **Role-Based Access Control (RBAC)**: Granular permissions for different user types
- **Subscription Management**: Tiered subscription system with usage tracking
- **Appointment System**: Complete scheduling with availability management
- **Medical Records**: Secure patient record management with doctor access controls
- **Analytics Engine**: Comprehensive reporting for practice and system metrics
- **Audit Logging**: Complete activity tracking for compliance
- **Data Validation**: Comprehensive input validation and sanitization

### Patient Features
- Appointment booking with subscription limit enforcement
- Personal medical record access
- Subscription management and usage tracking
- Profile management

### Doctor Features
- Patient appointment management
- Medical record creation and access
- Practice analytics and performance metrics
- Availability schedule management
- Patient roster management

### Administrator Features
- Complete user management (CRUD operations)
- System-wide analytics and reporting
- Subscription tier management
- System configuration and settings
- Audit trail access

## Architecture

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controllers   │    │    Services     │    │   Data Layer    │
│   (API Layer)   │    │ (Business Logic)│    │  (Persistence)  │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • HTTP Routes   │    │ • Domain Logic  │    │ • Prisma ORM    │
│ • Validation    │    │ • Authorization │    │ • SQLite DB     │
│ • Error Handling│    │ • Data Transform│    │ • Migrations    │
│ • Swagger Docs  │    │ • Business Rules│    │ • Seed Scripts  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Security Architecture
```
Request → JWT Guard → Roles Guard → Controller → Service → Database
    ↓         ↓           ↓           ↓          ↓         ↓
  Auth     Role       Endpoint    Business   Data      SQLite
 Check   Validation   Handler     Logic    Access
```

## Technology Stack

### Core Framework
- **NestJS 10**: Progressive Node.js framework with TypeScript
- **TypeScript**: Full type safety and enhanced developer experience
- **Express**: Underlying HTTP server framework

### Database & ORM
- **Prisma**: Type-safe database toolkit and ORM
- **SQLite**: Lightweight, file-based database for development
- **PostgreSQL**: Production database (configurable)

### Authentication & Security
- **Passport**: Authentication middleware
- **JWT**: JSON Web Tokens for stateless authentication
- **bcrypt**: Password hashing and validation
- **class-validator**: Input validation and sanitization

### Documentation & API
- **Swagger/OpenAPI**: Comprehensive API documentation
- **class-transformer**: Object transformation and serialization

### Development & Quality
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **Jest**: Testing framework
- **Supertest**: HTTP integration testing

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- SQLite (included) or PostgreSQL for production

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adrii-x/technical-assessment-pmhelp-adrian.git
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

   Configure your environment variables:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"
   
   # JWT Configuration
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   JWT_EXPIRATION="7d"
   
   # Application
   PORT=3000
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   
   # Seed the database with initial data
   npx prisma db seed
   ```

5. **Start Development Server**
   ```bash
   npm run start:dev
   ```

   The API will be available at `http://localhost:3000`

6. **Access API Documentation**
   Visit `http://localhost:3000/api` for interactive Swagger documentation

### Demo Data

The seed script creates demo users for testing:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Admin | `admin@medportal.test` | `password123` | System administrator |
| Doctor | `doctor@medportal.test` | `password123` | Healthcare provider |
| Patient | `patient@medportal.test` | `password123` | Healthcare consumer |

## Project Structure

```
src/
├── analytics/              # Analytics and reporting
│   ├── analytics.controller.ts
│   ├── analytics.service.ts
│   └── analytics.module.ts
│
├── appointment/             # Appointment management
│   ├── dto/
│   │   ├── create-appointment.dto.ts
│   │   └── update-appointment.dto.ts
│   ├── appointment.controller.ts
│   ├── appointment.service.ts
│   └── appointment.module.ts
│
├── auth/                    # Authentication & authorization
│   ├── dto/
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── types/
│   │   ├── jwt-payload.type.ts
│   │   └── request-with-user.type.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   ├── roles.decorator.ts
│   └── auth.module.ts
│
├── medical-records/         # Patient medical records
│   ├── dto/
│   │   └── create-medical-record.dto.ts
│   ├── medical-records.controller.ts
│   ├── medical-records.service.ts
│   ├── patient.controller.ts
│   └── medical-records.module.ts
│
├── prisma/                  # Database configuration
│   ├── prisma.service.ts
│   └── prisma.module.ts
│
├── subscription/            # Subscription management
│   ├── dto/
│   │   └── upgrade-subscription.dto.ts
│   ├── subscription.controller.ts
│   ├── subscription.service.ts
│   └── subscription.module.ts
│
├── User/                    # User management
│   ├── dto/
│   │   └── update-user-subscription.dto.ts
│   ├── user.controller.ts
│   ├── user.service.ts
│   └── user.module.ts
│
├── app.controller.ts        # Root application controller
├── app.service.ts          # Root application service
├── app.module.ts           # Main application module
└── main.ts                 # Application bootstrap
```

### Database Structure
```
prisma/
├── schema.prisma           # Database schema definition
├── migrations/             # Database migration files
├── seed.ts                # Database seeding script
└── dev.db                 # SQLite database file (development)
```

## Authentication & Authorization

### JWT Authentication Flow

1. **User Registration/Login**
   ```typescript
   POST /auth/login
   {
     "email": "user@example.com",
     "password": "password123"
   }
   
   // Response
   {
     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "id": 1,
       "email": "user@example.com",
       "role": "PATIENT"
     }
   }
   ```

2. **Protected Route Access**
   ```http
   GET /appointments/my
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Role-Based Access Control

```typescript
// Controller example
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  @Get('practice')
  @Roles('DOCTOR')
  async getPracticeAnalytics(@Request() req) {
    return this.analyticsService.getPracticeAnalytics(req.user.userId);
  }
  
  @Get('system')
  @Roles('ADMIN')
  async getSystemAnalytics() {
    return this.analyticsService.getSystemAnalytics();
  }
}
```

### Permission Matrix

| Resource | Patient | Doctor | Admin |
|----------|---------|--------|-------|
| Own Appointments | CRUD | Read | Read |
| Doctor Appointments | - | CRUD | Read |
| Medical Records (Own) | Read | - | Read |
| Medical Records (Patients) | - | CRUD | Read |
| User Management | - | - | CRUD |
| System Analytics | - | - | Read |
| Practice Analytics | - | Read | Read |

## API Endpoints

### Authentication Endpoints

```http
POST   /auth/register      # User registration
POST   /auth/login         # User login
GET    /auth/me            # Current user profile
POST   /auth/refresh       # Token refresh (if implemented)
```

### Patient Endpoints

```http
GET    /appointments/my         # Patient's appointments
POST   /appointments           # Book new appointment
PATCH  /appointments/:id       # Update appointment
GET    /medical-records/my     # Patient's medical records
GET    /subscriptions/my       # Current subscription
GET    /subscriptions/usage    # Subscription usage
POST   /subscriptions/upgrade  # Upgrade subscription
DELETE /subscriptions/cancel   # Cancel subscription
```

### Doctor Endpoints

```http
GET    /appointments              # Doctor's appointments
PATCH  /appointments/:id         # Update appointment status
POST   /medical-records          # Create medical record
GET    /patients/:id/records     # Patient's medical records
GET    /analytics/practice       # Practice analytics
```

### Admin Endpoints

```http
GET    /users                    # List all users
GET    /users/:id                # Get user details
POST   /users/:id/subscription   # Update user subscription
GET    /appointments             # All appointments
GET    /analytics/system         # System analytics
```

## Database Schema

### Core Tables

**Users Table**
```sql
- id (Primary Key)
- name (String)
- email (Unique, String)
- password (Hashed, String)
- role (Enum: ADMIN, DOCTOR, PATIENT)
- createdAt, updatedAt (Timestamps)
```

**Subscriptions Table**
```sql
- id (Primary Key)
- tier (Unique, String: free, basic, premium)
- allowedAppointmentsPerMonth (Integer, nullable for unlimited)
- priceCents (Integer)
- durationDays (Integer)
```

**Appointments Table**
```sql
- id (Primary Key)
- patientId (Foreign Key → Users)
- doctorId (Foreign Key → Users)
- date (DateTime)
- status (Enum: PENDING, CONFIRMED, CANCELLED, COMPLETED)
- reason (String, nullable)
```

**Medical Records Table**
```sql
- id (Primary Key)
- patientId (Foreign Key → Users)
- doctorId (Foreign Key → Users)
- recordType (String, nullable)
- notes (Text, nullable)
- attachments (JSON, nullable)
```

### Relationships

- Users → UserSubscriptions (One-to-Many)
- Users → Appointments (One-to-Many as Patient/Doctor)
- Users → MedicalRecords (One-to-Many as Patient/Doctor)
- Subscriptions → UserSubscriptions (One-to-Many)

## Security

### Security Measures

1. **Password Security**
   - bcrypt hashing with salt rounds
   - Minimum password complexity requirements
   - No plain text password storage

2. **JWT Security**
   - Short-lived access tokens
   - Secure secret key management
   - Token expiration and refresh

3. **Input Validation**
   - DTO validation with class-validator
   - SQL injection prevention via Prisma
   - XSS protection through sanitization

4. **Authorization**
   - Role-based access control
   - Resource-level permissions
   - User context validation

### Environment Security

```env
# Production security checklist
JWT_SECRET=use-a-long-random-string-at-least-32-characters
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@localhost:5432/medportal
CORS_ORIGIN=https://medportal.yourdomain.com
```

### CORS Configuration

```typescript
app.enableCors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

## Testing

### Testing Strategy

1. **Unit Tests**: Individual service methods and utilities
2. **Integration Tests**: Controller endpoints with database
3. **E2E Tests**: Complete user workflows

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e

# Generate coverage report
npm run test:cov
```

### Test Structure

```typescript
describe('AppointmentService', () => {
  let service: AppointmentService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AppointmentService, PrismaService],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create appointment for patient', async () => {
    // Test implementation
  });
});
```

### Sample Test Commands

```bash
# Test specific module
npm run test -- --testPathPattern=appointment

# Test with coverage
npm run test:cov

# Debug tests
npm run test:debug
```

## Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

### Environment Configuration

```env
# Production environment
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-production-jwt-secret
CORS_ORIGIN=https://your-frontend-domain.com
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

### Database Migrations

```bash
# Production database setup
npx prisma migrate deploy
npx prisma generate

# Reset database (development only)
npx prisma migrate reset
```

## Performance

### Performance Optimizations

1. **Database Optimization**
   - Proper indexing on frequently queried fields
   - Efficient Prisma queries with `select` and `include`
   - Connection pooling

2. **Caching Strategy**
   - In-memory caching for frequently accessed data
   - Redis integration for distributed caching
   - API response caching headers

3. **Query Optimization**
   ```typescript
   // Efficient user lookup with subscription
   const user = await this.prisma.user.findUnique({
     where: { id: userId },
     include: {
       userSubscriptions: {
         where: { active: true },
         include: { subscription: true }
       }
     }
   });
   ```

### Monitoring Endpoints

```http
GET /health          # Health check endpoint
GET /metrics         # Application metrics (if implemented)
```

## Monitoring & Logging

### Logging Strategy

```typescript
// Logger configuration
import { Logger } from '@nestjs/common';

export class AppointmentService {
  private readonly logger = new Logger(AppointmentService.name);

  async create(dto: CreateAppointmentDto) {
    this.logger.log(`Creating appointment for patient ${dto.patientId}`);
    
    try {
      const appointment = await this.createAppointment(dto);
      this.logger.log(`Appointment created with ID ${appointment.id}`);
      return appointment;
    } catch (error) {
      this.logger.error(`Failed to create appointment: ${error.message}`);
      throw error;
    }
  }
}
```

### Health Checks

```typescript
@Controller('health')
export class HealthController {
  @Get()
  async check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
    };
  }
}
```

## Contributing

### Development Workflow

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Follow coding standards and add tests
4. Ensure all tests pass: `npm test`
5. Update documentation if needed
6. Create pull request with description

### Code Standards

- Use TypeScript strict mode
- Follow NestJS conventions
- Write comprehensive tests
- Document API changes in Swagger
- Follow semantic commit messages

### Commit Message Format

```bash
type(scope): description

# Examples
feat(auth): add password reset functionality
fix(appointments): handle booking conflicts
docs(readme): update installation guide
test(users): add integration tests
```

## Troubleshooting

### Common Issues

**1. Database Connection Errors**
```bash
# Reset database
npx prisma migrate reset
npx prisma generate
npx prisma db seed
```

**2. JWT Token Issues**
- Verify JWT_SECRET is set correctly
- Check token expiration settings
- Ensure proper Bearer token format

**3. Permission Denied Errors**
- Verify user roles in database
- Check guard implementation
- Confirm route protection setup

**4. Migration Issues**
```bash
# Force migration (development only)
npx prisma migrate reset --force
npx prisma db push
```

### Debugging

1. **Enable Debug Logging**
   ```env
   DEBUG=prisma:*
   LOG_LEVEL=debug
   ```

2. **Database Query Logging**
   ```typescript
   // In prisma.service.ts
   const prisma = new PrismaClient({
     log: ['query', 'info', 'warn', 'error'],
   });
   ```

3. **API Testing**
   ```bash
   # Test authentication
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"patient@medportal.test","password":"password123"}'
   ```

### Performance Issues

- Check database query performance
- Monitor memory usage
- Profile API endpoint response times
- Verify proper indexing

### Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| 401 | Unauthorized | Check JWT token |
| 403 | Forbidden | Verify user role permissions |
| 404 | Not Found | Check resource existence |
| 409 | Conflict | Handle duplicate entries |
| 422 | Validation Error | Check input data format |
| 500 | Internal Error | Check logs for details |

## API Testing

### Postman Collection

Import the provided Postman collection for comprehensive API testing:

```json
{
  "info": { "name": "MedPortal API" },
  "auth": {
    "type": "bearer",
    "bearer": [{ "key": "token", "value": "{{jwt_token}}" }]
  }
}
```

### cURL Examples

```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@medportal.test","password":"password123"}'

# Get appointments (authenticated)
curl -X GET http://localhost:3000/appointments/my \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create appointment
curl -X POST http://localhost:3000/appointments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"doctorId":2,"availabilityId":1,"date":"2024-12-01","reason":"Consultation"}'
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions, issues, or contributions:
- Create an issue on GitHub
- Contact the development team
- Review the troubleshooting guide
- Check API documentation at `/api`

---

**MedPortal Backend** - Secure Healthcare Management API
Built with NestJS, TypeScript, and enterprise-grade security practices - By Adrian Okonkwo
