import os
import logging
from pathlib import Path

logger = logging.getLogger("graphflow-api")

# HTTPS Configuration
ENABLE_HTTPS = os.environ.get("ENABLE_HTTPS", "false").lower() == "true"
SSL_CERT_PATH = os.environ.get("SSL_CERT_PATH", "")
SSL_KEY_PATH = os.environ.get("SSL_KEY_PATH", "")

def validate_https_config():
    """
    Validates the HTTPS configuration if enabled.
    Returns a tuple of (is_valid, ssl_keyfile, ssl_certfile)
    """
    if not ENABLE_HTTPS:
        logger.info("HTTPS is disabled")
        return False, None, None
    
    logger.info("HTTPS is enabled, validating certificate files")
    
    # Validate certificate path
    cert_path = Path(SSL_CERT_PATH)
    if not cert_path.exists() or not cert_path.is_file():
        logger.error(f"SSL certificate file not found at {SSL_CERT_PATH}")
        return False, None, None
    
    # Validate key path
    key_path = Path(SSL_KEY_PATH)
    if not key_path.exists() or not key_path.is_file():
        logger.error(f"SSL key file not found at {SSL_KEY_PATH}")
        return False, None, None
    
    logger.info("HTTPS configuration is valid")
    return True, str(key_path), str(cert_path)

def get_https_config():
    """
    Returns the HTTPS configuration for uvicorn.
    """
    is_valid, ssl_keyfile, ssl_certfile = validate_https_config()
    
    if not is_valid:
        return {}
    
    return {
        "ssl_keyfile": ssl_keyfile,
        "ssl_certfile": ssl_certfile
    }

def get_server_url():
    """
    Returns the server URL based on the HTTPS configuration.
    """
    host = os.environ.get("HOST", "localhost")
    port = int(os.environ.get("PORT", "8000"))
    
    protocol = "https" if ENABLE_HTTPS else "http"
    return f"{protocol}://{host}:{port}" 