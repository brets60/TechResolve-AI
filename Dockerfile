# ==============================================================================
# Multi-Stage Dockerfile for TechResolve AI (FastAPI + React Production Build)
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Frontend Single Page Application
# ------------------------------------------------------------------------------
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend

# Install dependencies
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend source and compile production assets to dist/
COPY frontend/ ./
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Production Python Backend + Static Files
# ------------------------------------------------------------------------------
FROM python:3.12-slim AS runner

# Install essential runtime tools (curl for healthchecks, libpq for optional Postgres)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python requirements
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Copy compiled frontend from Stage 1 into /app/frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Ensure uploads directory exists
RUN mkdir -p /app/backend/uploads

WORKDIR /app/backend

# Railway injects $PORT dynamically. Default to 8000 if not set.
ENV PORT=8000
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:${PORT}/api/health || exit 1

# Start Uvicorn bound to 0.0.0.0 on Railway's $PORT
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
