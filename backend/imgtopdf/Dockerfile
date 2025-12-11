# Production-grade Dockerfile for Image to PDF Backend
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libjpeg-dev \
    zlib1g-dev \
    libtiff-dev \
    libwebp-dev \
    libpng-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY python/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY python/ .

# Create non-root user for security
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 5005

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:5005/health')"

# Start application with gunicorn
CMD ["gunicorn", "--config", "gunicorn.conf.py", "app:app"]
