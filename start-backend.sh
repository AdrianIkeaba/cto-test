#!/bin/bash

# Gym Backend Development Startup Script
echo "🏋️ Starting Gym Backend Development Environment"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install it and try again."
    exit 1
fi

echo "🔨 Building and starting services..."
docker-compose up --build -d

echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if PostgreSQL is ready
echo "🗄️ Checking PostgreSQL connection..."
if docker exec gym_postgres pg_isready -U gym_user -d gym_db; then
    echo "✅ PostgreSQL is ready"
else
    echo "❌ PostgreSQL is not ready yet"
fi

# Check if backend is ready
echo "🚀 Checking backend health..."
if curl -s http://localhost:8080/api/health > /dev/null; then
    echo "✅ Backend is ready"
else
    echo "⏳ Backend is still starting..."
fi

echo ""
echo "🎉 Gym Backend is starting up!"
echo ""
echo "📊 Service URLs:"
echo "  - Backend API: http://localhost:8080/api"
echo "  - API Documentation: http://localhost:8080/api/swagger-ui.html"
echo "  - Health Check: http://localhost:8080/api/health"
echo "  - PostgreSQL: localhost:5432 (gym_db)"
echo ""
echo "📋 Useful Commands:"
echo "  - View logs: docker-compose logs -f backend"
echo "  - Stop services: docker-compose down"
echo "  - Restart backend: docker-compose restart backend"
echo "  - Access database: docker exec -it gym_postgres psql -U gym_user -d gym_db"
echo ""
echo "🔍 Next Steps:"
echo "  1. Check API documentation at the URL above"
echo "  2. Test authentication endpoints"
echo "  3. Review the database schema"
echo ""
echo "Happy coding! 🚀"