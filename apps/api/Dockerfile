FROM ghcr.io/astral-sh/uv:latest AS uv

# ── Development ──────────────────────────────────────────
FROM python:3.11-slim AS development
COPY --from=uv /uv /uvx /bin/
WORKDIR /app/apps/api
COPY apps/api/pyproject.toml apps/api/uv.lock ./
ENV UV_SYSTEM_PYTHON=1
RUN uv sync
COPY apps/api/migrations ./migrations
COPY apps/api/alembic.ini .
EXPOSE 8000
CMD ["sh", "-c", "uv run alembic upgrade head && uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"]

# ── Production ───────────────────────────────────────────
FROM python:3.11-slim AS production
COPY --from=uv /uv /uvx /bin/
WORKDIR /app/apps/api
COPY apps/api/pyproject.toml apps/api/uv.lock ./
ENV UV_SYSTEM_PYTHON=1
RUN uv sync --no-dev
COPY apps/api/ .
EXPOSE 8000
CMD ["sh", "-c", "uv run alembic upgrade head && uv run uvicorn app.main:app --host 0.0.0.0 --port 8000"]
