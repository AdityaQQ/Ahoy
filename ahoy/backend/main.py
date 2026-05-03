from __future__ import annotations
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv
load_dotenv()

from routers.profile import router

limiter = Limiter(key_func=get_remote_address)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Ahoy backend starting...")
    yield

app = FastAPI(title="Ahoy API", description="GitHub Intelligence Platform", version="1.0.0", lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(CORSMiddleware, allow_origins=ORIGINS, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(router, prefix="/api/v1", tags=["Profile"])

@app.get("/")
async def root():
    return {"service": "Ahoy API", "version": "1.0.0", "status": "operational"}

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "github_token_set": bool(os.getenv("GITHUB_TOKEN")),
        "groq_key_set": bool(os.getenv("GROQ_API_KEY")),
    }

@app.exception_handler(Exception)
async def global_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"detail": str(exc)})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
