from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, ConsoleSpanExporter
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from fastapi import FastAPI
from app.core.config import settings
import os

def setup_tracing(app: FastAPI):
    resource = None # Can add resource info (service name) here
    
    provider = TracerProvider(resource=resource)
    
    # Simple logic: If OTLP endpoint is set, use it. Otherwise, if local and debug mode, use Console.
    # For now, let's just default to Console in local dev if we want to see it, 
    # but strictly speaking, we don't want to spam console in typical dev unless asked.
    
    # Check for OTLP endpoint in env (standard OTEL var)
    otlp_endpoint = os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT")
    
    if otlp_endpoint:
        processor = BatchSpanProcessor(OTLPSpanExporter(endpoint=otlp_endpoint))
        provider.add_span_processor(processor)
    elif settings.APP_ENV == "local":
        # In local, maybe we don't want spam unless we opt-in.
        # Uncomment to enable console tracing in local
        # processor = BatchSpanProcessor(ConsoleSpanExporter())
        # provider.add_span_processor(processor)
        pass

    trace.set_tracer_provider(provider)
    
    # Instrument FastAPI
    FastAPIInstrumentor.instrument_app(app, tracer_provider=provider)
