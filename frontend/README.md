# Wellnix-EHR Frontend

React-based frontend application for the Wellnix Electronic Health Record system.

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Tanstack Query** for API state management
- **Lucide React** for icons
- **Vite/CRA** for build tooling

## Features

- **Authentication**: JWT-based login/logout
- **Dashboard**: Role-based sidebar navigation
- **User Management**: CRUD operations for users (Admin only)
- **Protected Routes**: Role-based access control
- **Responsive Design**: Mobile-friendly interface

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Environment Variables

Create `.env` file:
```bash
REACT_APP_API_URL=http://localhost:3005
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components (Sidebar)
│   ├── navigation/     # Navigation components
│   ├── ui/             # Base UI components
│   └── users/          # User management components
├── contexts/           # React contexts (AuthContext)
├── Pages/              # Page components
├── services/           # API service functions
└── types/              # TypeScript type definitions
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## API Integration

The frontend communicates with the backend API at `http://localhost:3005` by default.

### Authentication Flow
1. User logs in → JWT token received
2. Token stored in localStorage
3. Token included in API requests
4. Protected routes check authentication status

## User Roles

- **Admin/Super Admin**: Access to user management
- **Doctor/Nurse**: Access to patient features (coming soon)