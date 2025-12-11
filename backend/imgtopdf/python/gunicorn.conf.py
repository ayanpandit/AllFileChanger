# Gunicorn configuration file for Railway deployment
import multiprocessing
import os

# Server socket
bind = f"0.0.0.0:{os.environ.get('PORT', '5005')}"
backlog = 2048

# Worker processes
workers = int(os.environ.get('GUNICORN_WORKERS', '2'))
worker_class = 'gevent'
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 50
timeout = 300
keepalive = 5

# Logging
accesslog = '-'
errorlog = '-'
loglevel = 'info'
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

# SSL (handled by Railway)
keyfile = None
certfile = None

# Performance
preload_app = True
worker_tmp_dir = '/dev/shm' if os.path.exists('/dev/shm') else None

def worker_int(worker):
    """Handle worker interruption"""
    worker.log.info("Worker received INT or QUIT signal")

def worker_abort(worker):
    """Handle worker abort"""
    worker.log.info("Worker received SIGABRT signal")
