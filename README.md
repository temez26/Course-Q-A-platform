# Course Q&A Platform

A full-stack web application that facilitates Q&A interactions for educational courses, featuring real-time communication and AI-powered responses.

## 🚀 Overview

This platform enables students and educators to engage in productive discussions through:

- **Real-time Q&A**: WebSocket-based instant messaging
- **AI Integration**: Automated responses using Facebook's OPT-125M model
- **Course Management**: Organized discussions by course topics
- **Voting System**: Community-driven content ranking

## 🏗️ Architecture

```
├── qa-ui/          # Frontend (Astro + Svelte + Tailwind)
├── qa-api/         # Backend API (Deno + WebSocket)
├── llm-api/        # LLM Service (FastAPI + Transformers)
├── nginx/          # Reverse proxy configuration
├── flyway/         # Database migrations
├── e2e-playwright/ # End-to-end tests
└── k6/             # Performance tests
```

## 🛠️ Tech Stack

- **Frontend**: Astro, Svelte, Tailwind CSS
- **Backend**: Deno, WebSocket, PostgreSQL
- **AI/ML**: FastAPI, Hugging Face Transformers
- **Infrastructure**: Docker, Nginx, Flyway
- **Testing**: Playwright, K6

## 📋 Prerequisites

- Docker & Docker Compose
- Git

## 🚀 Quick Start

### Development Environment

```bash
# Clone the repository
git clone <repository-url>
cd Course-Q-A-platform

# Start all services
docker compose up --build

# Access the application
open http://localhost:7800
```

### Production Environment

```bash
# Start production build
docker compose --profile prod up
```

## 🧪 Testing

### End-to-End Tests

```bash
cd e2e-playwright
docker compose run --entrypoint=npx e2e-playwright playwright test
```

### Performance Tests

```bash
cd k6
docker run -i --network="host" -v "%cd%:/k6" grafana/k6:master-with-browser run /k6/test.js
```

## 📊 Performance

The application handles:

- **100 concurrent users** with 2-second average response time
- **WebSocket connections** with 95% success rate
- **Database operations** optimized for real-time updates

See [PERFORMANCE_TEST_RESULTS.md](PERFORMANCE_TEST_RESULTS.md) for detailed metrics.

## 🔧 Configuration

Key configuration files:

- [`docker-compose.yml`](docker-compose.yml) - Development environment
- [`docker-compose.prod.yml`](docker-compose.prod.yml) - Production environment
- [`project.env`](project.env) - Environment variables

## 📁 Project Structure

- **[qa-ui/](qa-ui/)** - Frontend application with Astro and Svelte
- **[qa-api/](qa-api/)** - WebSocket API server with Deno
- **[llm-api/](llm-api/)** - Machine learning service
- **[flyway/sql/](flyway/sql/)** - Database schema and migrations

## 📚 Documentation

- [Database Schema](DATABASE.md)
- [Running Instructions](RUNNING.md)
- [Project Reflection](REFLECTION.md)
- [Performance Results](PERFORMANCE_TEST_RESULTS.md)

## ✨ Acknowledgments

- Built with Astro and Svelte for optimal performance
- Designed for scalability with Docker containerization
