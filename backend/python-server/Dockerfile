# ── AllFileChanger Python Backend ───────────────────────────────────────────
FROM python:3.11-slim

# System deps needed by some routes
RUN apt-get update && apt-get install -y --no-install-recommends \
    poppler-utils \
    tesseract-ocr \
    libreoffice-writer \
    default-jre-headless \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps first (better layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY . .

# Non-root user
RUN useradd -r -s /bin/false appuser
USER appuser

ENV FLASK_ENV=production
ENV PORT=5050

EXPOSE ${PORT}

# Use shell form so $PORT is expanded at runtime (Railway assigns its own port)
CMD gunicorn app:app --bind 0.0.0.0:${PORT} --workers 4 --timeout 120 --access-logfile -
