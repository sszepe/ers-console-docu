---
layout: doc
title: Docker Deployment
description: Production deployment of ERS using Docker Compose.
section: Admin Guide
permalink: /docs/admin/deployment/
---

## Architecture

The production stack runs four Docker services:

| Service | Image | Exposed |
|---|---|---|
| `db` | `postgres:16-alpine` | internal only |
| `django` | custom build (gunicorn) | internal :8000 |
| `qcluster` | same as django | none |
| `nginx` | custom build (nginx:1.27-alpine + SPA) | `HTTP_PORT` (default 8081) |

## Prerequisites

- Docker Engine ≥ 24 with Docker Compose v2
- A server with at least 1 GB RAM (2 GB recommended for the qcluster worker)
- A domain name and TLS termination if exposing publicly (use a reverse proxy or Traefik in front of nginx)

## Build

The nginx image bakes the compiled React SPA at build time. The frontend is built inside the `frontend-builder` stage and copied into the nginx image:

```dockerfile
# Stage 1: build the SPA
FROM node:20-alpine AS frontend-builder
…
RUN npm run build

# Stage 2: nginx + SPA
FROM nginx:1.27-alpine
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html
```

Build arguments:

| Arg | Default | Notes |
|---|---|---|
| `VITE_API_BASE_URL` | `""` (relative) | Set to an absolute URL if the API is on a different origin |
| `VITE_GEONAMES_USERNAME` | `"demo"` | GeoNames account for city imports |

To override build args:

```bash
docker compose build --build-arg VITE_GEONAMES_USERNAME=myusername
```

## Volumes

| Volume | Contents | Shared between |
|---|---|---|
| `postgres_data` | PostgreSQL data directory | `db` |
| `django_static` | `collectstatic` output | `django`, `nginx` (read-only) |
| `django_media` | User-uploaded files | `django`, `nginx` (read-only), `qcluster` |

## nginx routing

| Path | Served from |
|---|---|
| `/cockpit/` | SPA (`index.html`) via `try_files` |
| `/assets/` | Vite-hashed JS/CSS chunks (1-year immutable cache) |
| `/static/` | Django `collectstatic` volume (1-year immutable cache) |
| `/media/` | Django media volume (7-day cache) |
| `/api/`, `/accounts/`, `/admin/` | Proxied to `django:8000` |
| `/health/` | Proxied to `django:8000/api/schema/` |
| `/` | Redirects to `/cockpit/` |

## Reverse proxy / TLS

For production use, place a TLS-terminating reverse proxy (nginx, Traefik, Caddy) in front of the ERS nginx container. Set:

```bash
ALLOWED_HOSTS=yourdomain.com
CSRF_TRUSTED_ORIGINS=https://yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

And in the outer proxy, pass `X-Forwarded-Proto: https` — Django's `SECURE_PROXY_SSL_HEADER` is already configured to trust this header.

## Startup sequence

On `docker compose up -d`, the `django` service runs this startup command before gunicorn:

```sh
python manage.py migrate --noinput
python manage.py collectstatic --noinput
python manage.py createcachetable --noinput || true
python manage.py seed_countries
python manage.py ensure_superuser || true
gunicorn wsgi:application --config gunicorn_conf.py
```

This is **idempotent** — safe to run on every restart.

## Health checks

- `db`: `pg_isready` every 10 s, 5 retries
- `django`: `curl -f http://localhost:8000/api/schema/` every 30 s
- `nginx`: `wget -qO- http://localhost/health/` every 30 s

`qcluster` depends on `django` being healthy before starting.

## Updating

```bash
git pull
docker compose build
docker compose up -d
```

Migrations run automatically on startup.

## Scaling

Increase gunicorn workers by editing `gunicorn_conf.py` (default: 3 sync workers). For higher concurrency consider switching to `worker_class = "gthread"` with `threads = 4`.

Increase background task workers via `.env`:
```bash
Q_WORKERS=4
```
