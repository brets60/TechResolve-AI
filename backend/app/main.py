import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.services.knowledge_service import seed_knowledge_base
from app.routes.auth_routes import router as auth_router
from app.routes.session_routes import router as session_router
from app.routes.upload_routes import router as upload_router
from app.routes.knowledge_routes import router as knowledge_router
from app.routes.settings_routes import router as settings_router
from app.routes.cmd_routes import router as cmd_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed knowledge base
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        logger.info("Seeding initial Knowledge Base articles...")
        seed_knowledge_base(db)
    except Exception as e:
        logger.error(f"Error seeding knowledge base: {e}")
    finally:
        db.close()
    
    logger.info("TechResolve AI backend successfully initialized!")
    yield
    # Shutdown logic if any
    logger.info("TechResolve AI backend shutting down.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Intelligent IT troubleshooting assistant designed for beginners, office workers, and students.",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploads
app.mount("/api/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(session_router, prefix=settings.API_V1_STR)
app.include_router(upload_router, prefix=settings.API_V1_STR)
app.include_router(knowledge_router, prefix=settings.API_V1_STR)
app.include_router(settings_router, prefix=settings.API_V1_STR)
app.include_router(cmd_router, prefix=settings.API_V1_STR)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION
    }

@app.get("/api/download/apk")
def download_apk():
    import os
    from fastapi.responses import FileResponse
    from fastapi import HTTPException
    apk_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "TechResolve-AI.apk"))
    if not os.path.exists(apk_path):
        raise HTTPException(status_code=404, detail="APK build not found")
    return FileResponse(
        apk_path,
        media_type="application/vnd.android.package-archive",
        filename="TechResolve-AI.apk"
    )

# Mount Production Frontend Single Page Application if built
import os
from fastapi.responses import FileResponse

frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="frontend-assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Not Found")
        file_path = os.path.join(frontend_dist, full_path)
        if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))

