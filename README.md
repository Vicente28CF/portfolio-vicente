<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js&style=flat" alt="Next.js 15"/>
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&style=flat" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&style=flat" alt="PostgreSQL 16"/>
  <img src="https://img.shields.io/badge/Redis-7-DC382D?logo=redis&style=flat" alt="Redis 7"/>
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&style=flat" alt="Docker Compose"/>
  <br/>
  <img src="https://img.shields.io/badge/Python-3.11-3776AB?logo=python&style=flat" alt="Python 3.11"/>
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&style=flat" alt="TypeScript 5.7"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&style=flat" alt="Tailwind CSS 3.4"/>
  <img src="https://img.shields.io/badge/pnpm-11-F69220?logo=pnpm&style=flat" alt="pnpm 11"/>
</div>

# Portfolio — Vicente Flores

Personal portfolio and professional showcase built with a modern full-stack architecture. Features a blog-style project showcase, live coding demos, GitHub activity feed, skill matching engine, and contact form with email notifications.

🌐 **Live**: [portfolio-vicente-web.vercel.app](https://portfolio-vicente-web.vercel.app)  
⚙️ **API**: [portfolio-api-a9wi.onrender.com](https://portfolio-api-a9wi.onrender.com)  
📖 **Docs**: [portfolio-api-a9wi.onrender.com/docs](https://portfolio-api-a9wi.onrender.com/docs)

## Architecture

```
portfolio/
├── apps/
│   ├── api/          FastAPI backend (Python 3.11)
│   └── web/          Next.js 15 frontend (App Router)
├── docker-compose.yml
└── .github/workflows/   CI + Deploy pipelines
```

### API (`apps/api`)

| Endpoint | Description |
|---|---|
| `GET /api/projects` | Project showcase with normalized tech stack |
| `GET /api/skills` | Skills grouped by category |
| `POST /api/compatibility/` | Match skills vs job description |
| `GET /api/github/activity` | GitHub activity feed (Redis-cached, 600s) |
| `POST /api/contact` | Contact form (DB + SMTP email notification) |
| `GET /api/demo` | Live demo environment |
| `GET /health` | Health check |

Stack: FastAPI, SQLAlchemy (async), asyncpg, Alembic, Redis, Pydantic, pytest.

### Web (`apps/web`)

Sections: Hero, Tech Stack, GitHub Activity, Services, Projects, Compatibility Checker, Live Demo, Contact Form.

Stack: Next.js 15 App Router, React 19, Tailwind CSS 3, TypeScript 5, TanStack Query, Framer Motion, Vitest.

## Quick Start

Requires **Docker** and **Docker Compose** only — no local Node, Python, or pnpm needed.

```sh
# 1. Clone and enter
git clone https://github.com/Vicente28CF/portfolio-vicente.git
cd portfolio-vicente

# 2. Create env files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 3. Start everything
docker compose up -d
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| PostgreSQL | `localhost:5433` |
| Redis | `localhost:6380` |

## Development

### Commands

```sh
docker compose logs -f          # Live logs
docker compose build <service>  # Rebuild after dependency changes
docker compose exec <service> sh # Shell into container
```

### Testing

```sh
# API (pytest, coverage ≥80%)
docker compose exec api uv run pytest apps/api/tests/ --cov=app --cov-report=term-missing --cov-fail-under=80

# Web (Vitest)
docker compose exec web pnpm --filter web test
```

### Linting & Type Checking

```sh
# API (ruff)
docker compose exec api uv run ruff check apps/api/app/

# Web (tsc)
docker compose exec web pnpm --filter web type-check
```

### Database Migrations

```sh
# Create new migration
docker compose exec api uv run alembic revision --autogenerate -m "description"

# Apply pending migrations
docker compose exec api uv run alembic upgrade head
```

## Environment Variables

| Variable | Required | Default | Notes |
|---|---|---|---|
| `DATABASE_URL` | Yes | — | `postgresql+asyncpg://portfolio:portfolio_dev@postgres:5432/portfolio` |
| `REDIS_URL` | No | `redis://redis:6379` | Overriden in docker-compose |
| `SMTP_HOST` | No | `localhost` | Use `smtp.gmail.com` for Gmail |
| `SMTP_USERNAME` | No | — | Gmail App Password recommended |
| `SMTP_PASSWORD` | No | — | — |
| `CONTACT_RECIPIENT_EMAIL` | No | — | Email receiving contact form submissions |
| `NEXT_PUBLIC_API_URL` | Yes | — | Public API URL (e.g. `http://localhost:8000`) |
| `APP_ENV` | No | `development` | Set to `production` for deploy |
| `GITHUB_USERNAME` | No | `Vicente28CF` | GitHub activity feed source |

Full reference in `apps/api/.env.example` and `apps/web/.env.example`.

## Deployment

- **Web**: Vercel (auto-deployed via GitHub Actions on push to `main`)
- **API**: Render (via webhook, GitHub Actions on push to `main`)

### Production Checklist

- [ ] `APP_ENV=production`
- [ ] `ALLOWED_ORIGINS` set to production frontend domain
- [ ] Real SMTP credentials configured
- [ ] `CONTACT_RECIPIENT_EMAIL` configured
- [ ] Database migrations applied
- [ ] Reverse proxy (Caddy, Nginx) in front of API

## Projects

| Project | Stack | Status |
|---|---|---|
| [ENMICE](https://enmice.mx) | Next.js, TypeScript, Tailwind | Production |
| [CompuClub](https://compuclub.com.mx) | Next.js, TypeScript, Tailwind | In development |
| [Equipales Casillas](https://equipalescasillas.repl.co) | Python (Flask), HTML/CSS, JS | Live |
| And more... | | |

## License

MIT
