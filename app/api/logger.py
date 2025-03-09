import logging
import json
import os
import sys
from datetime import datetime
from typing import Any, Dict, Optional

# Configure logging format
class JsonFormatter(logging.Formatter):
    """
    Formatter that outputs JSON strings after parsing the log record.
    """
    def format(self, record: logging.LogRecord) -> str:
        """
        Format the log record as JSON.
        """
        log_object = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "module": record.module,
            "message": record.getMessage(),
        }
        
        # Add exception info if available
        if record.exc_info:
            log_object["exception"] = self.formatException(record.exc_info)
        
        # Add extra fields
        if hasattr(record, "data") and record.data:
            log_object["data"] = record.data
        
        return json.dumps(log_object)

def get_logger(name: str) -> logging.Logger:
    """
    Get a logger instance with the specified name.
    
    Args:
        name: The name of the logger
        
    Returns:
        A configured logger instance
    """
    logger = logging.getLogger(name)
    
    # Set the log level based on environment
    log_level = os.environ.get("LOG_LEVEL", "INFO").upper()
    logger.setLevel(getattr(logging, log_level))
    
    # Create console handler if not already added
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(JsonFormatter())
        logger.addHandler(handler)
    
    return logger

# Create a default logger for the API
api_logger = get_logger("api")

def log(level: str, message: str, module: str = "api", data: Optional[Dict[str, Any]] = None) -> None:
    """
    Log a message at the specified level.
    
    Args:
        level: The log level (debug, info, warning, error, critical)
        message: The log message
        module: The module name
        data: Additional data to include in the log
    """
    logger = get_logger(module)
    log_method = getattr(logger, level.lower())
    
    # Add extra data to the log record
    extra = {"data": data} if data else {}
    
    log_method(message, extra=extra)

def debug(message: str, module: str = "api", data: Optional[Dict[str, Any]] = None) -> None:
    """Log a debug message."""
    log("debug", message, module, data)

def info(message: str, module: str = "api", data: Optional[Dict[str, Any]] = None) -> None:
    """Log an info message."""
    log("info", message, module, data)

def warning(message: str, module: str = "api", data: Optional[Dict[str, Any]] = None) -> None:
    """Log a warning message."""
    log("warning", message, module, data)

def error(message: str, module: str = "api", data: Optional[Dict[str, Any]] = None) -> None:
    """Log an error message."""
    log("error", message, module, data)

def critical(message: str, module: str = "api", data: Optional[Dict[str, Any]] = None) -> None:
    """Log a critical message."""
    log("critical", message, module, data) 