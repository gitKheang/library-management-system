# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Library Management System built with Angular 20, featuring a client-side application with mock API functionality. The system manages books, users, loans, and administrative operations for a library.

## Development Commands

### Development Server
```bash
ng serve
# or
npm start
```
Application runs at `http://localhost:4200/` with live reload.

### Building
```bash
ng build                                      # Production build
ng build --configuration development          # Development build
npm run watch                                 # Watch mode for development
```
Build artifacts are stored in `dist/`.

### Testing
```bash
ng test                                       # Run Karma tests
ng test --include='**/path/to/file.spec.ts'  # Run specific test file
```

### Code Generation
```bash
ng generate component component-name          # Generate new component
ng generate service service-name              # Generate new service
ng generate guard guard-name                  # Generate new guard
ng generate --help                            # See all generation options
```

## Architecture

### Path Aliases
The project uses TypeScript path aliases configured in `tsconfig.json`:
- `@core/*` → `src/app/core/*` (models, services, guards, API layer)
- `@shared/*` → `src/app/shared/*` (shared components, icons)
- `@app/*` → `src/app/*` (root application code)

Always use these aliases when importing from these directories.

### Dependency Injection Pattern
The application uses Angular's dependency injection with a custom API abstraction:
- `LIBRARY_API` token (`@core/api/library-api.token.ts`) defines the injection token
- `LibraryApi` interface (`@core/api/library-api.types.ts`) defines the API contract
- `MockApiService` (`@core/services/mock-api.service.ts`) implements the interface
- Configured in `app.config.ts`: `{ provide: LIBRARY_API, useExisting: MockApiService }`

To inject the API in any service or component:
```typescript
private readonly api = inject(LIBRARY_API);
```

### State Management
The app uses Angular signals for reactive state management:
- `AuthService` (`@core/services/auth.service.ts`) manages authentication state using signals
- Components access state via computed signals: `user()`, `isAuthenticated()`, `hasManagementAccess()`
- Toast notifications managed through `ToastService` (`@core/services/toast.service.ts`)

### Authentication & Authorization
- **AuthService**: Manages user session with localStorage persistence and automatic session restoration
- **Guards**:
  - `authGuard`: Requires any authenticated user
  - `adminGuard`: Requires ADMIN role
  - `managementGuard`: Requires ADMIN or STAFF role
- **User Roles**: `USER`, `ADMIN`, `STAFF`
- Token storage: `localStorage.getItem('library-token')`

### Data Models
All TypeScript interfaces and types are centralized in `@core/models/library.models.ts`:
- Core entities: `User`, `Book`, `BookCopy`, `Loan`
- Enhanced types: `BookWithAvailability`, `LoanWithRelations`
- API payloads: `CreateBookPayload`, `UpdateBookPayload`, `CreateLoanPayload`
- Response types: `AuthResponse`, `DashboardStats`

### Route Structure
Routes are defined in `app.routes.ts`:
- Public: `/`, `/login`, `/register`, `/catalog`, `/books/:id`
- Authenticated: `/my-account` (requires `authGuard`)
- Management: `/admin/*` routes (requires `managementGuard`)

### Component Organization
```
src/app/
├── core/                  # Core business logic (singleton services, guards, models)
│   ├── api/              # API abstraction layer
│   ├── data/             # Mock data
│   ├── guards/           # Route guards
│   ├── models/           # TypeScript interfaces and types
│   └── services/         # Singleton services
├── shared/               # Reusable UI components
│   ├── components/       # Shared components (navigation, toast-container)
│   └── icons/            # Lucide icon configuration
└── pages/                # Feature pages (one directory per route)
    ├── admin/            # Admin feature pages
    ├── auth/             # Authentication pages
    ├── book-details/     # Book details page
    ├── catalog/          # Book catalog page
    ├── home/             # Home page
    ├── my-account/       # User account page
    └── not-found/        # 404 page
```

### Mock API Service
The `MockApiService` simulates a backend API with:
- In-memory data storage (books, users, loans, book copies)
- Simulated network delays (300ms default)
- Mock authentication using base64-encoded tokens
- Data reset functionality: `resetLibraryData()`

Initial mock data is stored in `@core/data/mock-data.ts`.

### Styling
- **Tailwind CSS**: Primary styling framework (config in `tailwind.config.js`)
- Global styles in `src/styles.css`
- PostCSS configured in `postcss.config.js`
- Autoprefixer enabled
- Component-specific styles should use Tailwind utility classes

### Icons
- Uses `lucide-angular` for icons
- Icons are selectively imported in `@shared/icons/lucide-icons.ts`
- Configured in `app.config.ts` via `importProvidersFrom(LucideAngularModule.pick(lucideIcons))`

### MongoDB Integration

The application integrates with MongoDB Atlas using Atlas App Services (Realm Web SDK):

**Architecture:**
- **Frontend**: Angular application with RealmApiService
- **Backend**: MongoDB Atlas App Services (serverless functions)
- **Database**: `library` database on MongoDB Atlas cluster
- **Authentication**: JWT tokens generated by Atlas Functions

**Key Services:**
- `RealmService` (`@core/services/realm.service.ts`): Low-level Realm SDK wrapper
- `RealmApiService` (`@core/services/realm-api.service.ts`): Implements all 18 LibraryApi methods
- Configuration in `@core/config/realm.config.ts`

**Setup Requirements:**
1. MongoDB Atlas App Services must be configured (see `ATLAS_FUNCTIONS.md`)
2. Atlas Functions deployed for authentication and transactions
3. App ID configured in `realm.config.ts`
4. Database seeded with initial data: `npm run seed`

**Collections:**
- `users` - User accounts (passwords hashed with bcrypt)
- `books` - Book catalog
- `bookCopies` - Physical book copies
- `loans` - Borrowing records

**Atlas Functions:**
Server-side functions handle sensitive operations:
- `registerUser`, `loginUser`, `getCurrentUser` - Authentication
- `hashPassword`, `verifyPassword` - Password security
- `createLoanWithTransaction`, `returnLoanWithTransaction` - Atomic operations

**Data Seeding:**
```bash
npm run seed  # Populates MongoDB with initial data from mock-data.ts
```

**Important Files:**
- `ATLAS_FUNCTIONS.md` - Complete setup guide for MongoDB Atlas
- `.mcp.json` - MCP configuration for database access
- `scripts/seed-mongodb.ts` - Database seeding script

## TypeScript Configuration
- Strict mode enabled with additional strictness flags
- ES2022 target with module preservation
- Experimental decorators enabled for Angular
- Isolated modules for better build performance
