# Gym Management System - Frontend

A modern React application for managing gym operations, built with Vite, TypeScript, Material UI, and React Query.

## Features

- **Authentication**: Complete auth flow with login, signup, email verification, and password reset
- **Responsive Design**: Mobile-first approach with Material UI responsive components
- **State Management**: Zustand for lightweight global state management
- **API Integration**: Axios client with JWT token handling and automatic refresh
- **Route Protection**: Guard components for authenticated and role-based routes
- **Material UI Theme**: Pre-configured Material Design theming with typography and colors
- **Data Tables**: Reusable DataTable component with pagination
- **KPI Cards**: Dashboard cards with metrics, trends, and progress indicators

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AppBar.tsx
│   ├── Sidebar.tsx
│   ├── KPICard.tsx
│   ├── DataTable.tsx
│   └── ProtectedRoute.tsx
├── pages/               # Page components
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── VerifyEmail.tsx
│   ├── ForgotPassword.tsx
│   ├── Dashboard.tsx
│   └── Unauthorized.tsx
├── layouts/             # Layout components
│   └── MainLayout.tsx
├── services/            # API services
│   ├── api.ts          # Axios client with interceptors
│   └── auth.ts         # Authentication service
├── stores/              # Zustand stores
│   └── authStore.ts    # Authentication state
├── theme/               # Material UI theme
│   └── theme.ts
├── types/               # TypeScript interfaces
│   └── index.ts
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
└── App.tsx              # Main app component
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
cd frontend
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building

Build for production:

```bash
npm run build
```

### Linting

Check code quality:

```bash
npm run lint
```

## Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Authentication

The app includes a complete authentication system:

1. **Login**: Sign in with email and password
2. **Signup**: Create a new account with validation
3. **Email Verification**: Verify email address with code
4. **Password Reset**: Request and confirm password reset
5. **JWT Tokens**: Automatic token refresh and storage
6. **Route Guards**: Protected routes with role-based access control

## API Integration

The axios client automatically:
- Adds JWT tokens to requests
- Refreshes tokens on 401 responses
- Handles 403 responses with redirect to unauthorized page
- Intercepts errors for proper handling

## Components

### AppBar
Header component with user menu and logout functionality.

### Sidebar
Navigation menu with role-based filtering of menu items.

### KPICard
Dashboard metric card with optional trend indicators and progress bars.

### DataTable
Reusable table component with pagination and click handlers.

### ProtectedRoute
Route guard that checks authentication and user role.

## Theme

Material UI theme is pre-configured with:
- Primary and secondary colors
- Typography hierarchy
- Component-level customizations
- Responsive breakpoints

## Technologies

- **React 18**: UI library
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety
- **Material UI (MUI)**: Component library
- **React Router**: Client-side routing
- **Zustand**: State management
- **Axios**: HTTP client
- **React Query**: Server state management (ready to integrate)
- **jwt-decode**: JWT token decoding

## Notes

- The API client expects JWT tokens in the Authorization header
- Tokens are stored in localStorage
- Failed auth attempts redirect to login page
- The app uses role-based access control (ADMIN, MEMBER, TRAINER, STAFF)

## License

Proprietary - Gym Management System
