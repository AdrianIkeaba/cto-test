# Gym Management System Backend

A Spring Boot 3.2.0 application with Java 17 providing JWT-based authentication and role-based access control for a gym management system.

## Features

- **JWT Authentication**: Secure token-based authentication with access and refresh tokens
- **Role-Based Access Control**: Four user roles (ADMIN, MEMBER, TRAINER, STAFF) with granular permissions
- **Email Verification**: Email verification system with token-based verification
- **Password Reset**: Secure password reset functionality with time-limited tokens
- **Database Migrations**: Flyway-based database schema management
- **OpenAPI Documentation**: Comprehensive API documentation with Swagger/OpenAPI 3
- **CORS Configuration**: Cross-origin resource sharing setup for frontend integration
- **Exception Handling**: Global exception handling with structured error responses
- **Health Monitoring**: Application health checks and monitoring endpoints
- **Docker Support**: Complete Docker containerization with health checks

## Technology Stack

- **Java 17**: Modern Java with latest features
- **Spring Boot 3.2.0**: Latest Spring Boot framework
- **Spring Security**: Security framework with JWT authentication
- **Spring Data JPA**: Data access layer with JPA
- **PostgreSQL**: Primary database
- **Flyway**: Database migration tool
- **Maven**: Build and dependency management
- **Lombok**: Code generation for reducing boilerplate
- **JWT**: JSON Web Token for authentication
- **Springdoc OpenAPI 3**: API documentation
- **Spring Boot Mail**: Email sending capabilities

## Prerequisites

- Java 17+
- Maven 3.8+
- Docker and Docker Compose (for containerized development)
- PostgreSQL 15+ (if running locally)

## Quick Start

### Using Docker Compose (Recommended)

1. Clone the repository and navigate to the project directory
2. Start all services:
   ```bash
   docker-compose up --build
   ```

3. The application will be available at:
   - Backend API: http://localhost:8080/api
   - API Documentation: http://localhost:8080/api/swagger-ui.html
   - Health Check: http://localhost:8080/api/health

### Local Development

1. Start PostgreSQL database
2. Update database configuration in `src/main/resources/application-dev.properties`
3. Build and run the application:
   ```bash
   mvn clean install
   mvn spring-boot:run -Dspring-boot.run.profiles=dev
   ```

## API Endpoints

### Authentication (`/auth`)

- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/password-reset` - Request password reset
- `POST /auth/password-reset-confirm` - Confirm password reset
- `GET /auth/verify-email` - Verify email address
- `POST /auth/logout` - User logout

### Health Check

- `GET /health` - Application health status
- `GET /` - Basic application information

### Protected Endpoints

Access to protected endpoints requires a valid JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Database Schema

The application creates the following main tables:

- `users` - User account information
- `roles` - System roles (ADMIN, MEMBER, TRAINER, STAFF)
- `user_roles` - User-role relationships (many-to-many)
- `member_profiles` - Gym member-specific information
- `trainer_profiles` - Trainer-specific information
- `staff_profiles` - Staff-specific information
- `email_verification_tokens` - Email verification tokens
- `password_reset_tokens` - Password reset tokens
- `audit_logs` - System audit trail

## User Roles

1. **ADMIN**: Full system access
2. **MEMBER**: Basic gym member access
3. **TRAINER**: Member and training management access
4. **STAFF**: Member support and basic management access

## Configuration

### Environment Variables

- `SPRING_DATASOURCE_URL` - Database connection URL
- `SPRING_DATASOURCE_USERNAME` - Database username
- `SPRING_DATASOURCE_PASSWORD` - Database password
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRATION` - JWT expiration time (milliseconds)
- `JWT_REFRESH_EXPIRATION` - Refresh token expiration time (milliseconds)
- `MAIL_HOST` - Email server host
- `MAIL_PORT` - Email server port
- `MAIL_USERNAME` - Email server username
- `MAIL_PASSWORD` - Email server password
- `CORS_ALLOWED_ORIGINS` - Allowed CORS origins

### Profiles

- **dev**: Development profile with detailed logging and H2 console
- **test**: Test profile with TestContainers integration
- **prod**: Production profile with optimized settings

## Testing

Run the test suite:
```bash
mvn test
```

Integration tests use TestContainers for PostgreSQL testing:
```bash
mvn test -Dspring.profiles.active=test
```

## API Documentation

OpenAPI 3 documentation is available at:
- Swagger UI: http://localhost:8080/api/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/api/v3/api-docs

## Logging

- Development: DEBUG level logging with SQL query logging
- Production: INFO level logging with performance optimization
- Logs are written to console and file (in production)

## Security Features

- **JWT Authentication**: Stateless token-based authentication
- **Password Encryption**: BCrypt password hashing
- **CORS Protection**: Configured cross-origin resource sharing
- **Role-Based Access**: Granular permission system
- **Input Validation**: Request validation using Bean Validation
- **SQL Injection Protection**: Parameterized queries with JPA
- **XSS Protection**: Input sanitization and output encoding

## Health Monitoring

- **Liveness Probe**: Application running status
- **Readiness Probe**: Database connectivity check
- **Metrics**: Application performance metrics via Actuator
- **Health Endpoints**: Detailed health information

## Development Guidelines

1. **Code Style**: Follow Spring Boot conventions
2. **Testing**: Write unit and integration tests for new features
3. **Documentation**: Update API documentation for new endpoints
4. **Security**: Review security implications for new features
5. **Database**: Use migrations for schema changes

## Deployment

### Docker Production Build

```bash
docker build -t gym-backend:latest .
```

### Kubernetes

Example Kubernetes deployment configuration:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gym-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: gym-backend
  template:
    metadata:
      labels:
        app: gym-backend
    spec:
      containers:
      - name: gym-backend
        image: gym-backend:latest
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "prod"
        - name: SPRING_DATASOURCE_URL
          value: "jdbc:postgresql://postgres:5432/gym_db"
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check PostgreSQL is running
   - Verify connection credentials
   - Ensure database exists

2. **JWT Token Issues**
   - Check JWT secret configuration
   - Verify token expiration settings
   - Ensure proper clock synchronization

3. **Email Service Issues**
   - Verify SMTP configuration
   - Check network connectivity
   - Validate email credentials

4. **CORS Errors**
   - Check allowed origins configuration
   - Verify frontend URL matches exactly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.