# Wellnix-EHR Backend

NestJS-based backend API for the Wellnix Electronic Health Record system.

## Tech Stack

- **NestJS** with TypeScript
- **PostgreSQL** database
- **TypeORM** for database operations
- **JWT** for authentication
- **bcrypt** for password hashing
- **class-validator** for input validation

## Features

- **Authentication**: JWT-based login system
- **User Management**: CRUD operations with role-based access
- **Database**: PostgreSQL with TypeORM migrations
- **Security**: Password hashing, input validation
- **API Documentation**: RESTful endpoints

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# Build for production
npm run build
npm run start:prod
```

### Database Setup

```bash
# Run migrations
npm run migration:run

# Generate migration
npm run migration:generate -- -n MigrationName

# Revert migration
npm run migration:revert
```

## Project Structure

```
src/
├── auth/               # Authentication module
├── user/               # User management module
├── common/             # Shared utilities
│   ├── interceptors/   # Response/logging interceptors
│   └── guards/         # Authentication guards
└── main.ts             # Application entry point
```

## Available Scripts

- `npm run start:dev` - Start development server
- `npm run start:prod` - Start production server
- `npm run build` - Build application
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
