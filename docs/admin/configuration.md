---
layout: page
title: Configuration Reference
permalink: /docs/admin/configuration/
---

All configuration is supplied via environment variables in the `.env` file. The `docker-compose.yml` passes these to each service.

---

## Required

These **must** be set — the stack will refuse to start without them.

| Variable | Description |
|---|---|
| `DJANGO_SECRET_KEY` | Django secret key. Generate: `python -c "import secrets; print(secrets.token_urlsafe(50))"` |
| `POSTGRES_PASSWORD` | Password for the `ersregistry` PostgreSQL role |

---

## Database

| Variable | Default | Description |
|---|---|---|
| `POSTGRES_DB` | `ersregistry` | PostgreSQL database name |
| `POSTGRES_USER` | `ersregistry` | PostgreSQL role name |
| `POSTGRES_HOST` | `db` | Hostname of the PostgreSQL server |
| `POSTGRES_PORT` | `5432` | PostgreSQL port |

---

## Django

| Variable | Default | Description |
|---|---|---|
| `ALLOWED_HOSTS` | `localhost,127.0.0.1` | Comma-separated allowed host headers |
| `CSRF_TRUSTED_ORIGINS` | `http://localhost` | Comma-separated trusted CSRF origins (must include scheme) |
| `CORS_ALLOWED_ORIGINS` | _(not set)_ | Comma-separated CORS origins. If unset, CORS is open (dev only). |
| `DJANGO_LOG_LEVEL` | `WARNING` | Log level for Django internals |
| `APP_LOG_LEVEL` | `INFO` | Log level for `apps.*` loggers |

---

## Superuser auto-creation

Set all three to auto-create the superuser on first startup. Ignored if the user already exists.

| Variable | Default | Description |
|---|---|---|
| `DJANGO_SUPERUSER_USERNAME` | `admin` | Username |
| `DJANGO_SUPERUSER_EMAIL` | `admin@localhost` | Email |
| `DJANGO_SUPERUSER_PASSWORD` | _(not set)_ | Password — leave unset to skip auto-creation |

---

## Network

| Variable | Default | Description |
|---|---|---|
| `HTTP_PORT` | `8081` | Host port mapped to nginx port 80 |

---

## Background tasks

| Variable | Default | Description |
|---|---|---|
| `Q_WORKERS` | `2` | Parallel django-q2 task workers in `qcluster` |

---

## Frontend build args

These are Docker **build arguments** (not runtime env vars) injected into the Vite build:

| Arg | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `""` | Base URL for API calls. Leave empty for same-origin. |
| `VITE_GEONAMES_USERNAME` | `demo` | GeoNames.org account. The `demo` account is rate-limited; register free at [geonames.org](https://www.geonames.org/login). |

---

## Example production `.env`

```bash
# Required
DJANGO_SECRET_KEY=your-50-char-random-key-here
POSTGRES_PASSWORD=a-strong-database-password

# Domain
ALLOWED_HOSTS=ers.yourinstitution.edu
CSRF_TRUSTED_ORIGINS=https://ers.yourinstitution.edu
CORS_ALLOWED_ORIGINS=https://ers.yourinstitution.edu

# Logging
DJANGO_LOG_LEVEL=WARNING
APP_LOG_LEVEL=INFO

# Network
HTTP_PORT=8081

# Background tasks
Q_WORKERS=4

# Superuser (first run only — change password immediately after login)
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@yourinstitution.edu
DJANGO_SUPERUSER_PASSWORD=change-me-immediately
```

<div class="callout callout-danger">
  <span class="callout-title">Security</span>
  Never commit your <code>.env</code> file to version control. Add it to <code>.gitignore</code>.
</div>

<div class="page-nav">
  <a href="/ers-docs/docs/admin/deployment/">← Docker Deployment</a>
  <a href="/ers-docs/docs/admin/database/">Database & Migrations →</a>
</div>
