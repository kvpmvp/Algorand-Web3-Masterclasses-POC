from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.core.config import settings
from app.db import Base, engine
from app.routes import projects, auth
from app.routes.projects import limiter as rate_limiter


app = FastAPI(title="Hyperdrive Backend", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.APP_CORS_ORIGINS.split(",") if o],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiting
app.add_middleware(SlowAPIMiddleware)
app.state.limiter = rate_limiter


# Routers
app.include_router(auth.router, prefix="/v1/auth", tags=["auth"])
app.include_router(projects.router, prefix="/v1/projects", tags=["projects"])


# DB init (dev convenience; replace with Alembic in prod)
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(engine)


# Rate limit handler
@app.exception_handler(RateLimitExceeded)
def ratelimit_handler(request, exc):
    return JSONResponse(status_code=429, content={"detail": "Rate limit exceeded"})