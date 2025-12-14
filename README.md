# Gym Management System

A comprehensive, full-stack gym management application designed to streamline operations for fitness centers. Inspired by platforms like GymMaster, this system provides tools for member management, scheduling, billing, and access control.

## Tech Stack

- **Frontend:** React + Material UI (MUI)
- **Backend:** Java Spring Boot
- **Database:** PostgreSQL
- **Containerization:** Docker & Docker Compose

## Repository Structure

The repository is organized into a monorepo structure to facilitate full-stack development, with clear separation of concerns to allow for future splitting into standalone repositories.

- `backend/` - Spring Boot application containing the core business logic and API.
- `frontend/` - React single-page application (SPA) serving as the user interface.
- `docs/` - Project documentation, including architecture and API specifications.
- `docker-compose.yml` - Orchestration for local development, provisioning the database and application services.

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Java 17+ (for local backend development)
- Node.js 18+ (for local frontend development)

### Quick Start (Docker)

To start the entire system (database, backend, and frontend) using Docker Compose:

```bash
docker-compose up -d
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api

### Local Development

#### Backend

1. Navigate to the `backend/` directory.
2. Run the Spring Boot application:

```bash
cd backend
./mvnw spring-boot:run
```

#### Frontend

1. Navigate to the `frontend/` directory.
2. Install dependencies and start the dev server:

```bash
cd frontend
npm install
npm run dev
```

## Documentation

For detailed architectural decisions and system design, please refer to [docs/architecture.md](docs/architecture.md).
