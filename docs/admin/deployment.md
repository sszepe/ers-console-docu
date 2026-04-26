---
layout: page
title: Docker Deployment
permalink: /docs/admin/deployment/
---

## Services

| Service | Image | Exposed |
|---|---|---|
| `db` | `postgres:16-alpine` | internal only |
| `django` | custom (gunicorn) | internal :8000 |
| `qcluster` | same as django | none |
| `nginx` | custom (nginx 1.27 + SPA) | `HTTP_PORT` (default 8081) |

---

## Multi-stage Docker build

The nginx image compiles the React SPA at build time using a multi-stage Dockerfile:

```dockerfile
# Stage 1 — build the SPA
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install --frozen-lockfile
ARG VITE_API_BASE_URL=""
ARG VITE_GEONAMES_USERNAME="demo"
COPY frontend/ ./
RUN npm run build

# Stage 2 — nginx + compiled SPA
FROM nginx:1.27-alpine
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
```

To override build args:

```bash
docker compose build --build-arg VITE_GEONAMES_USERNAME=myusername
```

---

## Django startup sequence

On every `docker compose up`, the `django` service runs this before gunicorn starts:

```bash
python manage.py migrate --noinput
python manage.py collectstatic --noinput
python manage.py createcachetable --noinput || true
python manage.py seed_countries
python manage.py ensure_superuser || true
gunicorn wsgi:application --config gunicorn_conf.py
```

All commands are **idempotent** — safe to run on every restart.

---

## Health checks

| Service | Probe | Interval |
|---|---|---|
| `db` | `pg_isready` | 10 s, 5 retries |
| `django` | `curl -f http://localhost:8000/api/schema/` | 30 s |
| `nginx` | `wget -qO- http://localhost/health/` | 30 s |

`qcluster` waits for `django` to be healthy before starting.

---

## Reverse proxy / TLS

For production, place a TLS-terminating proxy (nginx, Traefik, Caddy) in front of the ERS nginx container. Set:

```bash
ALLOWED_HOSTS=ers.yourdomain.edu
CSRF_TRUSTED_ORIGINS=https://ers.yourdomain.edu
CORS_ALLOWED_ORIGINS=https://ers.yourdomain.edu
```

Django's `SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")` is already configured to trust the forwarded proto header.

---

## Updating

```bash
git pull
docker compose build
docker compose up -d
# Migrations run automatically on startup
```

---

## Scaling

**API workers:** edit `gunicorn_conf.py` (default: 3 sync workers). For higher concurrency, switch to `worker_class = "gthread"` with `threads = 4`.

**Background workers:** set `Q_WORKERS=4` in `.env`.

<div class="page-nav">
  <a href="/ers-docs/docs/admin/">← Admin Overview</a>
  <a href="/ers-docs/docs/admin/configuration/">Configuration Reference →</a>
</div>
