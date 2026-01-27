# showcase-blog

A multi-service showcase project demonstrating OAuth2/OIDC authentication with Spring Authorization Server, a Spring Boot backend, an Angular frontend, Redis session caching, and oauth2-proxy for centralized authentication.

## Architecture

- **auth-server**: Spring Authorization Server providing OAuth2/OIDC authentication
- **backend**: Spring Boot API server (protected by OAuth2)
- **frontend**: Angular application
- **oauth2-proxy**: Handles authentication flow and proxies requests to backend and frontend
- **redis**: Session storage for oauth2-proxy

## Prerequisites

- Java 21+ (for building the Spring Boot applications)
- Node.js and npm (for frontend development)
- Docker and Docker Compose

## Setup Guide

### 1. Build the Docker Images

The auth-server and backend projects need to be built and packaged as Docker images first.

**Build the auth-server image:**

```bash
cd auth-server
./gradlew bootBuildImage
```

**Build the backend image:**

```bash
cd backend
./gradlew bootBuildImage
```

### 2. Start the Applications

#### 2.1 "Frontend Development" Mode

Once the Docker images are built, start all services except the using Docker Compose:

```bash
docker-compose -f docker-compose-frontend-dev.yml up
```

That Docker Compose setup will expect to reach a running frontend on the host using port `4200`.
Since the proxy will be forwarding to that, we need to serve the frontend on the whole host:

```bash
ng serve --host 0.0.0.0
```

#### 2.2 "Just start everything" Mode

Once the Docker images are built, start all services using Docker Compose:

```bash
docker-compose -f docker-compose.yml up
```

### 3. Access the Application

Navigate to [http://localhost:4180](http://localhost:4180) in your browser.

You will be redirected to the login page. Use the following credentials:

- **Username:** `user`
- **Password:** `password`

After successful authentication, you will be redirected to the frontend home page.

## URL Routing

All traffic goes through oauth2-proxy on port 4180:

- `/api/*` requests are routed to the backend
- All other requests are routed to the frontend
