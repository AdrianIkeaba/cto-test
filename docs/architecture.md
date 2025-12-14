# Architecture & System Design

## Overview

The Gym Management System is a robust web application tailored for the fitness industry. It is designed to handle the complex requirements of gym operations, including member lifecycle management, class scheduling, billing integration, and access control. The system aims to provide a seamless experience for both gym staff and members.

## Objectives

Inspired by GymMaster, the key objectives of this system are:
- **Member Management:** Comprehensive profiles, membership tiers, and attendance tracking.
- **Scheduling:** Drag-and-drop calendar for booking classes, personal training, and resource allocation.
- **Billing & POS:** Automated recurring payments, invoice generation, and point-of-sale functionality.
- **Access Control:** Integration points for door access systems (simulated or API-driven).
- **Reporting:** Analytics on revenue, retention, and utilization.

## Technology Stack

### Frontend
- **Framework:** React
- **UI Library:** Material UI (MUI) for a responsive and modern aesthetic.
- **State Management:** Context API / Redux (as complexity grows).
- **Communication:** Axios for REST API consumption.

### Backend
- **Framework:** Spring Boot (Java)
- **Database Access:** Spring Data JPA / Hibernate.
- **Security:** Spring Security with JWT for stateless authentication.
- **API Documentation:** Swagger/OpenAPI.

### Database
- **Engine:** PostgreSQL
- **Migration:** Flyway or Liquibase (to be decided) for schema versioning.

## Deployment Strategy

### Containerization
The application is fully containerized using Docker.
- **Frontend Container:** Nginx serving static React build files.
- **Backend Container:** OpenJDK image running the Spring Boot JAR.
- **Database Container:** Standard PostgreSQL image.

### Orchestration
`docker-compose` is used for local development and simplified single-node deployment. For production, Kubernetes or a managed cloud service (like AWS ECS or Heroku) is recommended.

### Configuration
Environment variables are used to configure database connections, API keys, and feature flags. These are documented in the `docker-compose.yml` and sample `.env` files.

## Monorepo Strategy & Future Separation

The project is currently structured as a monorepo to accelerate initial development and sharing of types/contracts. However, the `frontend/` and `backend/` directories are designed to be completely decoupled.

To split into standalone repositories in the future:
1. **Move Directories:** Simply move the `frontend/` folder to a new git repository and `backend/` to another.
2. **CI/CD:** Set up independent CI/CD pipelines for each repository.
3. **Contract Testing:** Implement consumer-driven contracts (e.g., Pact) to ensure API compatibility remains intact across separate repos.
4. **Proxy:** Configure the local development proxy or CORS settings to handle the cross-origin requests that will arise when the apps are served from different domains/repos.
