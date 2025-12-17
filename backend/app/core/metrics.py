from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST
from fastapi import FastAPI, Response
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

ACTIVE_RIDES = Gauge(
    "active_rides",
    "Number of rides currently in progress"
)

PAYMENT_FAILURES_TOTAL = Counter(
    "payment_failures_total",
    "Total number of failed payments",
    ["reason"]
)

# --- Middleware ---
class PrometheusMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        method = request.method
        path = request.url.path
        
        # Don't track metrics endpoint itself to avoid noise
        if path == "/metrics":
            return await call_next(request)

        start_time = time.time()
        try:
            response = await call_next(request)
            status_code = response.status_code
        except Exception as e:
            status_code = 500
            raise e
        finally:
            duration = time.time() - start_time
            
            # Record metrics
            HTTP_REQUESTS_TOTAL.labels(method=method, endpoint=path, status=status_code).inc()
            HTTP_REQUEST_DURATION_SECONDS.labels(method=method, endpoint=path).observe(duration)
            
        return response

# --- Setup Function ---
def setup_metrics(app: FastAPI):
    app.add_middleware(PrometheusMiddleware)
    
    @app.get("/metrics")
    async def metrics():
        return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)
