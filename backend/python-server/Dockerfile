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

EXPOSE 5050

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:5050/health')" || exit 1

CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5050", "--workers", "4", "--timeout", "120", "--access-logfile", "-"]
