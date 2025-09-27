# MedPortal Frontend

A modern, secure, and comprehensive healthcare management system frontend built with React, TypeScript, and Tailwind CSS. MedPortal provides role-based access control for Patients, Doctors, and Administrators with a focus on security, performance, and user experience.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Authentication & Security](#authentication--security)
- [API Integration](#api-integration)
- [Component Library](#component-library)
- [Development Guidelines](#development-guidelines)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

## Overview

MedPortal Frontend is the client-side application for a comprehensive healthcare management system. It provides secure, role-based interfaces for three distinct user types:

- **Patients**: Book appointments, view medical records, manage subscriptions
- **Doctors**: Manage patient appointments, view analytics, handle medical records
- **Administrators**: System oversight, user management, comprehensive analytics

The application integrates seamlessly with a NestJS backend and implements enterprise-grade security measures including JWT authentication, role-based access control, and comprehensive error handling.

## Features

### Core Features
- **Secure Authentication**: JWT-based authentication with automatic token refresh
- **Role-Based Access Control**: Granular permissions for different user types
- **Responsive Design**: Mobile-first approach with professional healthcare UI
- **Real-time Data**: React Query for efficient data fetching and caching
- **Comprehensive Error Handling**: User-friendly error messages and recovery

### Patient Features
- Schedule and manage medical appointments
- View personal medical records and history
- Subscription management with usage tracking
- Healthcare provider search and booking

### Doctor Features
- Patient appointment management
- Medical record creation and management
- Practice analytics and performance metrics
- Patient roster and history access

### Administrator Features
- System-wide user management
- Comprehensive analytics dashboard
- Subscription and billing oversight
- System configuration and settings

## Architecture

### Frontend Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │    │    Business     │    │      Data       │
│     Layer       │    │     Logic       │    │     Layer       │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • React Pages   │    │ • Custom Hooks  │    │ • API Services  │
│ • Components    │    │ • Contexts      │    │ • React Query   │
│ • Forms         │    │ • Validations   │    │ • Token Storage │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Security Architecture
- JWT tokens with automatic refresh
- Role-based route protection
- Secure token storage with expiration handling
- CSRF protection through proper token handling
- Input validation and sanitization

## Technology Stack

### Core Technologies
- **React 18**: Latest React with concurrent features
- **TypeScript**: Full type safety and development experience
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing with protection

### State Management & Data Fetching
- **React Query (TanStack Query)**: Server state management and caching
- **React Context**: Authentication and theme state
- **Zustand** (optional): Client-side state management

### UI & Components
- **Shadcn/UI**: High-quality, accessible component library
- **Radix UI**: Headless component primitives
- **Lucide React**: Modern icon library
- **React Hook Form**: Performant form handling

### Development & Quality
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **Vitest**: Unit testing framework
- **TypeScript**: Static type checking

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- Access to MedPortal backend API

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/medportal-frontend.git
   cd medportal-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

   Configure your environment variables:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   VITE_APP_NAME=MedPortal
   VITE_ENABLE_DEV_TOOLS=true
   ```

4. **Install UI Components**
   ```bash
   npx shadcn-ui@latest init
   npx shadcn-ui@latest add button card input label alert
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

### Demo Credentials

For development and testing, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Patient | `patient@example.com` | `password123` |
| Doctor | `doctor@example.com` | `password123` |
| Admin | `admin@example.com` | `password123` |

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn/UI base components
│   ├── layout/          # Layout components (Header, Sidebar)
│   ├── forms/           # Form components
│   ├── charts/          # Analytics chart components
│   ├── common/          # Shared utility components
│   └── modals/          # Modal components
│
├── pages/               # Page components organized by role
│   ├── auth/            # Authentication pages
│   ├── patient/         # Patient-specific pages
│   ├── doctor/          # Doctor-specific pages
│   ├── admin/           # Admin-specific pages
│   └── shared/          # Shared pages (404, errors)
│
├── services/            # API and external services
│   ├── api/             # API client and endpoints
│   ├── websocket/       # Real-time features (optional)
│   └── storage/         # Local storage utilities
│
├── hooks/               # Custom React hooks
│   ├── auth/            # Authentication hooks
│   ├── api/             # React Query hooks
│   └── common/          # Utility hooks
│
├── contexts/            # React contexts
│   ├── AuthContext.tsx  # Authentication state
│   ├── ThemeContext.tsx # Theme management
│   └── NotificationContext.tsx
│
├── lib/                 # Utility libraries
│   ├── utils.ts         # General utilities
│   ├── validations.ts   # Form validation schemas
│   ├── constants.ts     # Application constants
│   ├── permissions.ts   # RBAC logic
│   ├── formatters.ts    # Data formatting
│   ├── errorHandling.ts # Error utilities
│   └── authHelpers.ts   # JWT utilities
│
├── types/               # TypeScript definitions
│   ├── api.ts           # API types
│   ├── auth.ts          # Authentication types
│   ├── user.ts          # User types
│   └── index.ts         # Type exports
│
├── styles/              # Global styles
│   └── globals.css      # Tailwind and custom CSS
│
├── config/              # Configuration files
│   ├── env.ts           # Environment variables
│   ├── routes.ts        # Route definitions
│   └── queryClient.ts   # React Query config
│
└── assets/              # Static assets
    ├── images/
    └── icons/
```

## Authentication & Security

### JWT Authentication Flow

1. **Login Process**
   ```typescript
   const { login } = useAuth();
   await login({ email, password });
   // Token automatically stored and attached to requests
   ```

2. **Token Management**
   - Automatic token refresh before expiration
   - Secure storage with expiration checking
   - Request interceptors for authentication headers

3. **Role-Based Access**
   ```typescript
   <ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN']}>
     <DoctorDashboard />
   </ProtectedRoute>
   ```

### Security Features

- **Token Security**: JWT tokens with automatic refresh and expiration handling
- **Route Protection**: Role-based route guards preventing unauthorized access
- **Input Validation**: Comprehensive validation using Zod schemas
- **Error Handling**: Secure error messages that don't leak sensitive information
- **HTTPS Only**: All API communications over secure connections

## API Integration

### API Client Architecture

The application uses a centralized API client with automatic authentication and error handling:

```typescript
// Automatic authentication
const response = await apiClient.get('/appointments');

// Type-safe requests
const appointment = await appointmentApi.create({
  doctorId: 1,
  date: '2024-01-15',
  reason: 'Consultation'
});
```

### Endpoint Organization

```
src/services/api/
├── apiClient.ts      # Axios configuration with interceptors
├── authApi.ts        # Authentication endpoints
├── appointmentApi.ts # Appointment CRUD operations
├── userApi.ts        # User management
├── medicalRecordApi.ts # Medical records
└── subscriptionApi.ts # Subscription management
```

### React Query Integration

```typescript
// Custom hooks for data fetching
const { data: appointments, isLoading, error } = useAppointments();
const createMutation = useCreateAppointment();

// Optimistic updates and caching
await createMutation.mutateAsync(appointmentData);
```

## Component Library

### UI Component Hierarchy

```
Components
├── Base Components (Shadcn/UI)
│   ├── Button, Input, Card, etc.
│   └── Accessible, themeable primitives
│
├── Composite Components
│   ├── Forms (LoginForm, AppointmentForm)
│   ├── Charts (Analytics components)
│   └── Data Tables (User lists, appointments)
│
└── Layout Components
    ├── DashboardLayout (Main app shell)
    ├── Header (Navigation, user menu)
    └── Sidebar (Role-based navigation)
```

### Design System

- **Colors**: Healthcare-focused blue primary with semantic colors
- **Typography**: Inter font family with proper hierarchy
- **Spacing**: Consistent 8px grid system
- **Components**: Accessible, keyboard navigable, screen reader friendly

### Custom Components

```typescript
// Status badges with semantic colors
<StatusBadge status="confirmed" />

// Loading states with accessibility
<LoadingSpinner size="lg" text="Loading appointments..." />

// Empty states with actions
<EmptyState 
  icon={<Calendar />}
  title="No appointments yet"
  action={<Button>Book Appointment</Button>}
/>
```

## Development Guidelines

### Code Standards

1. **TypeScript**: Strict mode enabled, comprehensive type coverage
2. **Component Structure**: Functional components with hooks
3. **Error Boundaries**: Wrap route components for graceful failures
4. **Accessibility**: WCAG 2.1 AA compliance
5. **Performance**: Code splitting, lazy loading, optimized re-renders

### File Organization

- Use kebab-case for files: `user-dashboard.tsx`
- Group related files in directories
- Index files for clean imports
- Separate concerns: logic, UI, types

### State Management

```typescript
// Server state with React Query
const { data, mutate } = useAppointments();

// Client state with Context/useState
const { user } = useAuth();

// Form state with React Hook Form
const { register, handleSubmit } = useForm();
```

### Error Handling Pattern

```typescript
try {
  await apiOperation();
} catch (error) {
  const message = getUserFriendlyErrorMessage(error);
  toast.error(message);
  logError(error, { context: 'Operation context' });
}
```

## Testing

### Testing Strategy

1. **Unit Tests**: Individual functions and hooks
2. **Component Tests**: UI component behavior
3. **Integration Tests**: API integration and user flows
4. **E2E Tests**: Complete user journeys (optional)

### Testing Setup

```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Testing Utilities

```typescript
// Custom test utilities
import { renderWithAuth, createMockUser } from '../lib/testUtils';

test('should render patient dashboard', () => {
  const user = createMockUser({ role: 'PATIENT' });
  renderWithAuth(<PatientDashboard />, { user });
});
```

## Deployment

### Build Process

```bash
# Production build
npm run build

# Preview build locally
npm run preview

# Type checking
npm run type-check
```

### Environment Configuration

```env
# Production
VITE_API_BASE_URL=https://api.medportal.com
VITE_APP_NAME=MedPortal
VITE_ENABLE_DEV_TOOLS=false
```

### Deployment Platforms

- **Vercel**: Recommended for easy deployment
- **Netlify**: Alternative with similar features
- **AWS S3 + CloudFront**: For AWS infrastructure
- **Docker**: Containerized deployment

### Performance Optimization

- Code splitting by routes
- Component lazy loading
- Image optimization
- Bundle size analysis
- Service worker for caching (optional)

## Contributing

### Development Workflow

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes following coding standards
4. Add tests for new functionality
5. Ensure all tests pass: `npm test`
6. Create pull request with description

### Code Review Checklist

- [ ] TypeScript errors resolved
- [ ] Tests added/updated
- [ ] Accessibility considerations
- [ ] Error handling implemented
- [ ] Performance impact assessed
- [ ] Security implications reviewed

### Git Conventions

```bash
# Commit message format
type(scope): description

# Examples
feat(auth): add password reset functionality
fix(api): handle network timeout errors
docs(readme): update installation instructions
```

## Troubleshooting

### Common Issues

**1. Authentication Errors**
```bash
# Clear stored tokens
localStorage.clear();
# Restart development server
npm run dev
```

**2. API Connection Issues**
- Verify `VITE_API_BASE_URL` in environment
- Check backend server is running
- Confirm CORS configuration

**3. Build Errors**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**4. Type Errors**
```bash
# Restart TypeScript server in VS Code
Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

### Performance Issues

- Use React DevTools Profiler
- Check bundle size: `npm run build` and analyze
- Monitor React Query cache
- Optimize re-renders with React.memo

### Environment Variables

Ensure all required variables are set:
```bash
# Check environment variables
echo $VITE_API_BASE_URL
```

### Debugging Tips

1. **Authentication**: Check browser Network tab for 401 errors
2. **Routing**: Verify ProtectedRoute configurations
3. **API**: Use React Query DevTools in development
4. **State**: Use React DevTools for component state
5. **Performance**: Use Lighthouse for performance audits

## API Documentation

The frontend expects the following backend endpoints:

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Current user info
- `POST /auth/refresh` - Token refresh

### Patient Endpoints
- `GET /appointments/my` - Patient appointments
- `POST /appointments` - Book appointment
- `GET /medical-records/my` - Patient records
- `GET /subscriptions/my` - Current subscription

### Doctor Endpoints
- `GET /appointments` - Doctor appointments
- `GET /patients/:id/records` - Patient medical records
- `POST /medical-records` - Create medical record
- `GET /analytics/practice` - Practice analytics

### Admin Endpoints
- `GET /users` - All users
- `POST /users/:id/subscription` - Update user subscription
- `GET /analytics/system` - System analytics
- `GET /appointments` - All appointments

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues:
- Create an issue on GitHub
- Contact the development team
- Check the troubleshooting guide above

---

**MedPortal Frontend** - Modern Healthcare Management System
Built with React, TypeScript, and modern web technologies.