import time
import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from app.config import settings
from app.database import create_tables, database_is_reachable
from app.routers import contact, demo, github, projects, skills, compatibility


class TimingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        start = time.perf_counter()
        request_id = str(uuid.uuid4())[:8]
        response = await call_next(request)
        duration_ms = (time.perf_counter() - start) * 1000
        response.headers["X-Process-Time"] = f"{duration_ms:.2f}"
        response.headers["X-Request-ID"] = request_id
        return response

@asynccontextmanager
async def lifespan(_app: FastAPI):
    if settings.app_env != "production" and database_is_reachable():
        try:
            await create_tables()
        except Exception:
            pass
    yield


app = FastAPI(title="Portfolio API", version="0.1.0", lifespan=lifespan)

app.add_middleware(TimingMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.app_env != "production" else settings.allowed_origins_list,
    allow_credentials=False if settings.app_env != "production" else True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Process-Time", "X-Request-ID"],
)

app.include_router(projects.router)
app.include_router(skills.router)
app.include_router(contact.router)
app.include_router(demo.router)
app.include_router(github.router)
app.include_router(compatibility.router)


@app.get("/health")
async def health():
    return {"status": "ok", "version": "0.1.0"}
