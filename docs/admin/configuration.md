---
layout: doc
title: Configuration Reference
description: All environment variables recognised by ERS, with defaults and descriptions.
section: Admin Guide
permalink: /docs/admin/configuration/
---

All configuration is supplied via environment variables, typically stored in a `.env` file at the project root. The `docker-compose.yml` passes these to each service.

## Required variables

These **must** be set — the stack will refuse to start without them.

| Variable | Description |
|---|---|
| `DJANGO_SECRET_KEY` | Django secret key. Generate with `python -c "import secrets; print(secrets.token_urlsafe(50))"`. Never reuse across environments. |
| `POSTGRES_PASSWORD` | Password for the `ersregistry` PostgreSQL role. |

## Database

| Variable | Default | Description |
|---|---|---|
| `POSTGRES_DB` | `ersregistry` | PostgreSQL database name |
| `POSTGRES_USER` | `ersregistry` | PostgreSQL role name |
| `POSTGRES_HOST` | `db` (service name) | Hostname of the PostgreSQL server |
| `POSTGRES_PORT` | `5432` | PostgreSQL port |

## Django

| Variable | Default | Description |
|---|---|---|
| `DJANGO_SETTINGS_MODULE` | `ersregistry.settings.production` | Settings module to use |
| `ALLOWED_HOSTS` | `localhost,127.0.0.1` | Comma-separated list of allowed host headers |
| `CSRF_TRUSTED_ORIGINS` | `http://localhost` | Comma-separated list of trusted CSRF origins (must include scheme) |
| `CORS_ALLOWED_ORIGINS` | _(not set — all allowed)_ | Comma-separated list of allowed CORS origins. If not set, CORS is open (development only). |
| `DJANGO_LOG_LEVEL` | `WARNING` | Log level for Django internals (`DEBUG`, `INFO`, `WARNING`, `ERROR`) |
| `APP_LOG_LEVEL` | `INFO` | Log level for `apps.*` loggers |

## Superuser auto-creation

Set all three to auto-create the superuser on first startup. Ignored if the user already exists.

| Variable | Default | Description |
|---|---|---|
| `DJANGO_SUPERUSER_USERNAME` | `admin` | Username for the auto-created superuser |
| `DJANGO_SUPERUSER_EMAIL` | `admin@localhost` | Email for the auto-created superuser |
| `DJANGO_SUPERUSER_PASSWORD` | _(not set)_ | Password for the auto-created superuser. Leave unset to skip auto-creation. |

## Network

| Variable | Default | Description |
|---|---|---|
| `HTTP_PORT` | `8081` | Host port mapped to nginx container port 80 |

## Background tasks

| Variable | Default | Description |
|---|---|---|
| `Q_WORKERS` | `2` | Number of parallel django-q2 task workers in the `qcluster` service |

## Frontend build args

These are Docker build arguments (not runtime env vars) injected into the Vite build:

| Arg | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `""` | Base URL for API calls. Leave empty for same-origin. Set to `https://api.yourdomain.com` for cross-origin deployments. |
| `VITE_GEONAMES_USERNAME` | `demo` | GeoNames.org account username for city import tasks. The `demo` account is rate-limited; register a free account at [geonames.org](https://www.geonames.org/login). |

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

# Port (if behind a reverse proxy, leave at default)
HTTP_PORT=8081

# Background tasks
Q_WORKERS=4

# Superuser (first run only)
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@yourinstitution.edu
DJANGO_SUPERUSER_PASSWORD=change-me-immediately-after-login
```

<div class="callout callout--danger">
  <div class="callout__title">Security</div>
  Never commit your <code>.env</code> file to version control. Add it to <code>.gitignore</code>.
</div>
