from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import logging
import os
import sys

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.api.database import Base
from app.api.models import Graph, GraphNode, GraphEdge, GraphRun, GraphExecution
from app.api.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    """Initialize the database by creating all tables."""
    try:
        # Create database engine
        engine = create_engine(
            settings.DATABASE_URL,
            connect_args={"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
        )
        
        # Create all tables
        logger.info("Creating database tables...")
        Base.metadata.drop_all(bind=engine)  # Drop existing tables
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully.")
        
        # Create session
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        # Add sample data if needed
        # ...
        
        db.close()
        
        return True
    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")
        return False

if __name__ == "__main__":
    logger.info("Initializing database...")
    success = init_db()
    if success:
        logger.info("Database initialization completed successfully.")
    else:
        logger.error("Database initialization failed.") 