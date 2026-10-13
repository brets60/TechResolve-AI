import os
import uvicorn

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0" if os.getenv("PORT") else "127.0.0.1")
    reload = os.getenv("RELOAD", "false" if os.getenv("PORT") else "true").lower() == "true"
    uvicorn.run("app.main:app", host=host, port=port, reload=reload)
