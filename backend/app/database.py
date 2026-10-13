from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

# Handle database URL format (Railway provides postgres:// which SQLAlchemy 2.0 requires as postgresql://)
db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

# Handle sqlite connect_args
connect_args = {}
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    db_url,
    connect_args=connect_args,
    pool_pre_ping=True
)

def ensure_db_schema():
    from sqlalchemy import text
    try:
        with engine.connect() as conn:
            for col_name, col_sql in [
                ("avatar_url", "VARCHAR(500)"),
                ("auth_provider", "VARCHAR(50) DEFAULT 'local'"),
                ("google_id", "VARCHAR(255)")
            ]:
                try:
                    conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_sql}"))
                    conn.commit()
                except Exception:
                    pass
    except Exception:
        pass

ensure_db_schema()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
