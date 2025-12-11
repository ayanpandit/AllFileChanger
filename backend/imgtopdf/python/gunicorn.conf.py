"""
Gunicorn configuration file for production deployment
Optimized for Railway.app with proper worker configuration
"""

import os
import multiprocessing

# Server socket
bind = f"0.0.0.0:{os.environ.get('PORT', '5005')}"
backlog = 2048

# Worker processes
workers = int(os.environ.get('WEB_CONCURRENCY', multiprocessing.cpu_count() * 2 + 1))
worker_class = 'gevent'
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 100
timeout = 120
keepalive = 5

# Logging
accesslog = '-'
errorlog = '-'
loglevel = os.environ.get('LOG_LEVEL', 'info')
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Process naming
proc_name = 'imgtopdf'

# Server mechanics
daemon = False
pidfile = None
umask = 0
user = None
group = None
tmp_upload_dir = None

# SSL (if needed)
keyfile = None
certfile = None

# Preload app for better performance
preload_app = True

# Server hooks
def on_starting(server):
    server.log.info("🚀 Image to PDF server starting...")

def when_ready(server):
    server.log.info(f"✅ Server ready on {bind}")
    server.log.info(f"👷 Workers: {workers}")

def on_exit(server):
    server.log.info("👋 Server shutting down...")
