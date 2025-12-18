import logging
import time
import json
from typing import Callable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import StreamingResponse
from starlette.concurrency import iterate_in_threadpool
import datetime

# Configure a specific logger for requests
request_logger = logging.getLogger("backend_requests")
request_logger.setLevel(logging.INFO)

# Create a file handler
file_handler = logging.FileHandler("backend_requests.log")
file_handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)
request_logger.addHandler(file_handler)

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start_time = time.time()
        
        # Read and log request body
        # Note: Reading the request body consumes it, so we need to cache it
        # and then restore it so downstream handlers can read it again.
        request_body_bytes = await request.body()
        await self.set_body(request, request_body_bytes)
        
        request_body_str = ""
        try:
             request_body_str = request_body_bytes.decode("utf-8")
        except:
             request_body_str = "<binary or non-utf8>"

        response = await call_next(request)
        
        process_time = time.time() - start_time
        
        # Capture response body if possible
        response_body = b""
        
        # We need to preserve the response iterator/stream
        if isinstance(response, StreamingResponse):
            response_body = b""
            async for chunk in response.body_iterator:
                response_body += chunk
            
            # Re-create the iterator for the actual response
            response.body_iterator = iterate_in_threadpool(iter([response_body]))
        else:
            # For standard responses
             # Starlette responses usually have .body if they are not streaming, 
             # but often call_next returns a StreamingResponse or Response that has been rendered.
             # If it's a standard Response, we can access .body directly if rendered.
             pass

        # If status code is 422 or 500, we definitely want detailed logs
        if response.status_code >= 400:
            log_data = {
                "timestamp": datetime.datetime.now().isoformat(),
                "method": request.method,
                "url": str(request.url),
                "status_code": response.status_code,
                "process_time_ms": round(process_time * 1000, 2),
                "request_headers": dict(request.headers),
                "request_body": request_body_str,
                "response_body": response_body.decode('utf-8', errors='replace') if response_body else "<empty or stream>"
            }
            
            request_logger.info(json.dumps(log_data, indent=2))
            
        return response

    async def set_body(self, request: Request, body: bytes):
        async def receive():
            return {"type": "http.request", "body": body, "more_body": False}
        request._receive = receive
