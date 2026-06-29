# JournalApp - AI-Powered Journaling Platform

A full-stack journaling application with AI-powered sentiment analysis, weekly mood tracking, and weather integration.

## Tech Stack

**Backend:** Java 25, Spring Boot 3.5, MongoDB, Redis, Apache Kafka, Spring Security (JWT + OAuth2)

**Frontend:** React 19, Vite 8, Tailwind CSS 4, Framer Motion, Lucide Icons

**DevOps:** Maven, GitHub Actions CI, SonarCloud

## Features

- User authentication with JWT and Google OAuth2
- Create, read, update, and delete journal entries
- AI sentiment analysis via Google Gemini 2.0 Flash API (with keyword-based fallback)
- Weekly sentiment reports delivered via email (Kafka + SMTP)
- Weather dashboard with Redis-cached data
- Dark/light theme with glassmorphism UI
- Admin dashboard for user management

## Prerequisites

- JDK 25
- Node.js 20+
- MongoDB (running on localhost:27017)
- Redis (running on localhost:15641)
- Apache Kafka (running on localhost:9092)

## Quick Start

### 1. Environment Variables

Copy `.env` to the project root and fill in your values:

```bash
JWT_SECRET=your-256-bit-secret
GEMINI_API_KEY=your-gemini-api-key
```

### 2. Run Backend

```bash
cd journalApp-master
./mvnw spring-boot:run
```

### 3. Run Frontend

```bash
cd journal-ui
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## API Documentation

Once the backend is running, visit `http://localhost:8080/swagger-ui.html` for interactive API docs.

## Project Structure

```
journalApp-master/
  src/main/java/net/journalApp/
    controller/     - REST API endpoints
    service/        - Business logic services
    config/         - Spring Security, Redis, Swagger config
    entity/         - MongoDB document models
    repository/     - Data access layer
    scheduler/      - Cron jobs for weekly reports
    filter/         - JWT authentication filter
    cache/          - In-memory config cache
    utilis/         - JWT utility
journal-ui/
  src/
    components/     - React UI components
    api/            - Axios HTTP client
```
