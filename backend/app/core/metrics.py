from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST
from fastapi import FastAPI, Response, Request
from starlette.middleware.base import BaseHTTPMiddleware
import time

# --- Metrics Declarations ---
HTTP_REQUESTS_TOTAL = Counter(
    "http_requests_total",
    "Total count of HTTP requests",
    ["method", "endpoint", "status"]
)

HTTP_REQUEST_DURATION_SECONDS = Histogram(
    "http_request_duration_seconds",
    "Histogram of HTTP request duration in seconds",
    ["method", "endpoint"]
)

# Business Metrics (Rides)
RIDES_CREATED_TOTAL = Counter(
    'rides_created_total',
    'Total rides created'
)

RIDES_COMPLETED_TOTAL = Counter(
    'rides_completed_total',
    'Total rides completed'
)

RIDES_CANCELLED_TOTAL = Counter(
    'rides_cancelled_total',
    'Total rides cancelled',
    ['cancelled_by']
)

ACTIVE_RIDES = Gauge(
    "active_rides",
    "Number of rides currently in progress"
)

DRIVERS_ONLINE = Gauge(
    'drivers_online',
    'Currently online drivers'
)

# Financial Metrics
PAYMENTS_TOTAL = Counter(
    'payments_total',
    'Total payments',
    ['method', 'status']
)

SETTLEMENTS_PENDING_TOTAL = Gauge(
    'settlements_pending_total',
    'Total pending settlements'
)

PAYMENT_FAILURES_TOTAL = Counter(
    "payment_failures_total",
    "Total number of failed payments",
    ["reason"]
)

# --- Middleware ---
class PrometheusMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        method = request.method
        path = request.url.path
        
        # Don't track metrics endpoint itself or health check
        if path in ["/metrics", "/health", "/health/ready"]:
            return await call_next(request)

        start_time = time.time()
        status_code = 500
        
        try:
            response = await call_next(request)
            status_code = response.status_code
            return response
        except Exception as e:
            status_code = 500
            raise e
        finally:
            duration = time.time() - start_time
            
            # Record metrics
            HTTP_REQUESTS_TOTAL.labels(method=method, endpoint=path, status=status_code).inc()
            HTTP_REQUEST_DURATION_SECONDS.labels(method=method, endpoint=path).observe(duration)

# --- Setup Function ---
def setup_metrics(app: FastAPI):
    app.add_middleware(PrometheusMiddleware)
    
    @app.get("/metrics")
    async def metrics():
        return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)
