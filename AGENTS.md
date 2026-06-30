# AGENTS.md — Portfolio monorepo

## Quick start (local)

```sh
# Arrancar todo (back + front + db + redis)
docker compose up -d

# Si ya todo está armado, solo iniciar:
docker compose start

# Forzar rebuild + fresh start (limpia cachés)
docker compose down -v && docker compose up -d

# Logs
docker compose logs -f

# URLs:
# - Frontend: http://localhost:3000
# - API:      http://localhost:8000
# - Docs API: http://localhost:8000/docs
# - DB:       localhost:5433 (user: portfolio, pass: portfolio_dev)
# - Redis:    localhost:6380
```

## Stack

| Layer | Stack | Container |
|---|---|---|
| Frontend | Next.js 15 (App Router, Tailwind v3, React 19, standalone output) | `portfolio-web` |
| Backend | FastAPI + SQLAlchemy async + asyncpg, Python >=3.11 | `portfolio-api` |
| Database | PostgreSQL 16 Alpine | `portfolio-db` |
| Cache | Redis 7 Alpine | `portfolio-redis` |

## Docker-first setup (no local installations)

Solo necesitas Docker y Docker Compose. Nada de Node, Python, pnpm, uv instalado en tu máquina.

### Primer arranque

```sh
# 1. Crear .env a partir de ejemplos
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 2. Levantar todo
docker compose up -d

# 3. Ver logs
docker compose logs -f
```

- API: http://localhost:8000 (docs en http://localhost:8000/docs)
- Web: http://localhost:3000
- PostgreSQL: `localhost:5433` (usuario `portfolio`, db `portfolio`)
- Redis: `localhost:6380`

### Tras cambiar dependencias

Si modificas `pyproject.toml`, `package.json` o `pnpm-lock.yaml`, reconstruye la imagen:

```sh
docker compose build api    # O
docker compose build web    # O
docker compose build        # Todo
```

### Notas del montaje por volumen

- El código fuente se monta desde tu máquina al contenedor (`.:/app`).
- Los directorios `node_modules/` y `.next/` se **preservan del contenedor** (anonymous volumes) para no sobrescribirlos con el bind mount.
- API hot-reload via uvicorn `--reload`. Web hot-reload via Next.js dev mode.

## Commands (todo dentro de Docker, nada local)

| Acción | Comando |
|---|---|
| Iniciar todo | `docker compose up -d` |
| Detener todo | `docker compose down` |
| Logs en vivo | `docker compose logs -f` |
| Rebuild servicio | `docker compose build <service>` |
| Rebuild todo | `docker compose build` |
| Shell dentro del contenedor | `docker compose exec <service> sh` |
| Tests (API) | `docker compose exec api uv run pytest apps/api/tests/ --cov=app --cov-report=term-missing --cov-fail-under=80` |
| Tests (web) | `docker compose exec web pnpm --filter web test` |
| Lint (API) | `docker compose exec api uv run ruff check apps/api/app/` |
| Type check (web) | `docker compose exec web pnpm --filter web type-check` |
| Migración nueva | `docker compose exec api uv run alembic revision --autogenerate -m "desc"` |
| Aplicar migraciones | `docker compose exec api uv run alembic upgrade head` |
| Consola PostgreSQL | `docker compose exec postgres psql -U portfolio -d portfolio` |
| Redis CLI | `docker compose exec redis redis-cli` |

## Environment variables

| Variable | App | Required | Default | Notas |
|---|---|---|---|---|
| `APP_ENV` | api | No | `development` | `production` desactiva `create_all` y activa CORS estricto |
| `DATABASE_URL` | api | **Sí** | — | En Docker: `postgresql+asyncpg://portfolio:portfolio_dev@postgres:5432/portfolio` |
| `ALLOWED_ORIGINS` | api | No | `http://localhost:3000` | Orígenes CORS separados por coma |
| `SMTP_HOST` | api | No | `localhost` | Para Gmail: `smtp.gmail.com` |
| `SMTP_PORT` | api | No | `1025` | — |
| `SMTP_USERNAME` | api | No | `""` | Para SMTP con autenticación (Gmail, etc.) |
| `SMTP_PASSWORD` | api | No | `""` | — |
| `SMTP_USE_TLS` | api | No | `false` | `true` para Gmail/Outlook (puerto 587) |
| `SMTP_FROM_EMAIL` | api | No | `portfolio@vicenteflores.dev` | Remitente del email |
| `CONTACT_RECIPIENT_EMAIL` | api | No | — | Email que recibe los contactos |
| `API_PORT` | api | No | `8000` | — |
| `REDIS_URL` | api | No | `redis://localhost:6380` | En Docker: `redis://redis:6379` |
| `GITHUB_USERNAME` | api | No | `Vicente28CF` | Usuario de GitHub para el endpoint de actividad |
| `NEXT_PUBLIC_API_URL` | web | **Sí** | — | URL pública de la API (ej: `http://localhost:8000`) |

Los valores de `DATABASE_URL` y `REDIS_URL` se sobrescriben en `docker-compose.yml` para que apunten a los nombres de servicio internos de Docker. Las variables `SMTP_*` se leen directamente del `.env`.

## Production

### Build de imágenes producción

```sh
docker compose build api --target production
docker compose build web --target production
```

### Production checklist

- [ ] `APP_ENV=production` — desactiva `create_all`, activa CORS restringido
- [ ] `ALLOWED_ORIGINS` apuntando al dominio real del frontend
- [ ] `DATABASE_URL` con contraseña fuerte y SSL si aplica
- [ ] `CONTACT_RECIPIENT_EMAIL` configurado
- [ ] `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD` con credenciales reales (Gmail, SendGrid, etc.)
- [ ] `SMTP_USE_TLS=true` si el servidor SMTP lo requiere
- [ ] `REDIS_URL` apuntando a una instancia Redis real
- [ ] `GITHUB_USERNAME` correcto
- [ ] `NEXT_PUBLIC_API_URL` apuntando a la URL de producción de la API
- [ ] Migraciones aplicadas (se ejecutan automáticamente al arrancar el API)
- [ ] Reverse proxy (Caddy, Nginx) en lugar de exponer puertos directo
- [ ] Health checks configurados en el orquestador

### Targets de deploy actuales

- **API**: Render (mediante webhook, GitHub Actions en push a `main`)
- **Web**: Vercel (GitHub Actions en push a `main`)

## Arquitectura

- **API** (`apps/api/app/`): `config.py` carga `.env` con pydantic-settings. Migraciones con Alembic. En no-producción corre `create_all` como fallback al arranque. Routers en `routers/`, lógica en `services/`, schemas en `schemas/`, modelos SQLAlchemy en `models/`.
- **Web** (`apps/web/src/`): App Router en `app/`, componentes en `components/` (sections/, ui/), API client en `lib/api.ts`. Usa `@tanstack/react-query`.
- **Endpoints destacados**: `POST /api/compatibility/` (match skills vs descripción), `GET /api/github/activity` (proxy con caché Redis 600s), `POST /api/contact` (guarda en DB + envía email vía SMTP), `GET /api/projects`, `GET /api/skills`.
- **Audiencia**: React context en `sessionStorage` toggle recruiter/client.
- **CI/CD**: GitHub Actions corre lint → type-check → test en PRs; deploy a Render y Vercel en `main`.
- **Testing (API)**: pytest-asyncio `auto`, httpx `AsyncClient` con `ASGITransport`, DB real sin SQLite in-memory. Cobertura mínima 80%.
- **Testing (web)**: Vitest con jsdom, framer-motion y lucide-react mockeados globalmente en `vitest.setup.ts`. `@/` alias → `src/`.
