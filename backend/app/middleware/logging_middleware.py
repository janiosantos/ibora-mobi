import logging
import json
import time
import datetime
from starlette.types import ASGIApp, Receive, Scope, Send, Message

# Configure a specific logger for requests
request_logger = logging.getLogger("backend_requests")
request_logger.setLevel(logging.INFO)

# Create a file handler
file_handler = logging.FileHandler("backend_requests.log")
file_handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)
request_logger.addHandler(file_handler)

class RequestLoggingMiddleware:
    """
    Pure ASGI middleware for logging requests and responses, specifically for debugging 422/500 errors.
    Bypasses BaseHTTPMiddleware limitations by wrapping the receive/send channels directly.
    """
    def __init__(self, app: ASGIApp):
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        # Prepare to capture request body
        request_body = b""
        
        async def wrapped_receive() -> Message:
            nonlocal request_body
            message = await receive()
            if message["type"] == "http.request":
                 body = message.get("body", b"")
                 if body:
                     request_body += body
            return message

        # Prepare to capture response
        response_body = b""
        response_status_code = 200
        start_time = time.time()
        
        async def wrapped_send(message: Message):
            nonlocal response_body, response_status_code
            
            if message["type"] == "http.response.start":
                response_status_code = message["status"]
            elif message["type"] == "http.response.body":
                response_body += message.get("body", b"")
            
            await send(message)

        try:
            await self.app(scope, wrapped_receive, wrapped_send)
        finally:
             if response_status_code >= 400:
                process_time = time.time() - start_time
                
                request_body_str = ""
                try:
                     request_body_str = request_body.decode("utf-8")
                except:
                     request_body_str = "<binary or non-utf8>"

                log_data = {
                    "timestamp": datetime.datetime.now().isoformat(),
                    "method": scope.get("method"),
                    "url": str(scope.get("path")),
                    "query_string": scope.get("query_string", b"").decode("utf-8"),
                    "status_code": response_status_code,
                    "process_time_ms": round(process_time * 1000, 2),
                    # "request_headers": ... (headers are raw bytes in ASGI, tricky to parse easily here without bloat)
                    "request_body": request_body_str,
                    "response_body": response_body.decode('utf-8', errors='replace') if response_body else "<empty or stream>"
                }
                
                request_logger.info(json.dumps(log_data, indent=2))
