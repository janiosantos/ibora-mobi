import sys
import structlog
import logging
from typing import Any, Dict
from app.core.config import settings

def configure_logging() -> None:
    """
    Configures structlog and standard logging.
    """
    
    # Determine if we should output JSON
    json_logs = settings.APP_ENV in ["production", "staging"]
    log_level = "INFO" # Could also come from settings

    shared_processors = [
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
    ]

    # Structlog Configuration
    structlog.configure(
        processors=shared_processors + [
            # Prepare event dict for `ProcessorFormatter`
            structlog.stdlib.ProcessorFormatter.wrap_for_formatter,
        ],
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

    # Standard Library Logging Configuration
    processor_formatter = structlog.stdlib.ProcessorFormatter(
        # These run ONLY on `logging` entries that didn't come from structlog
        foreign_pre_chain=shared_processors,
        
        # These run on EVERYTHING (structlog + standard logging)
        processors=[
            structlog.stdlib.ProcessorFormatter.remove_processors_meta,
            structlog.processors.JSONRenderer() if json_logs else structlog.dev.ConsoleRenderer(),
        ],
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(processor_formatter)
    
    root_logger = logging.getLogger()
    root_logger.handlers = [handler]
    root_logger.setLevel(getattr(logging, log_level.upper()))
    
    # Silence overly verbose loggers if needed
    logging.getLogger("uvicorn.access").handlers = [handler]
    logging.getLogger("uvicorn.access").propagate = False

def get_logger(name: str):
    return structlog.get_logger(name)
