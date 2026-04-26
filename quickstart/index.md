---
layout: doc
title: Quickstart
description: Run the full ERS stack locally with Docker Compose in under five minutes.
section: Getting Started
permalink: /quickstart/
---

## Prerequisites

- **Docker ≥ 24** and **Docker Compose v2** (`docker compose` without a hyphen)
- Git
- A terminal

## 1 — Clone the repositories

ERS ships as two separate repos that are combined at deploy time. Clone both side by side:

```bash
git clone -b dev https://github.com/sszepe/django-ers-solution.git
git clone -b dev https://github.com/sszepe/ers-console.git
```

The `django-ers-solution` repo contains the `docker-compose.yml` that wires everything together. The `ers-console` frontend source is expected at `./frontend/` inside the solution root (symlink or copy it there):

```bash
cd django-ers-solution
ln -s ../ers-console frontend   # or: cp -r ../ers-console frontend
```

## 2 — Create your `.env` file

```bash
cp .env.example .env
```

Open `.env` and set **at minimum** the two required secrets:

```bash
DJANGO_SECRET_KEY=<generate with: python -c "import secrets; print(secrets.token_urlsafe(50))">
POSTGRES_PASSWORD=your-strong-password
```

All other values have sensible defaults. See the [Configuration Reference](/docs/admin/configuration/) for the full list.

<div class="callout callout--tip">
  <div class="callout__title">Auto-create a superuser</div>
  Uncomment and fill in the <code>DJANGO_SUPERUSER_*</code> lines in <code>.env</code> to have the first admin account created automatically on startup.
</div>

## 3 — Start the stack

```bash
docker compose up -d
```

This starts four services:

| Service | Role |
|---|---|
| `db` | PostgreSQL 16 (Alpine) |
| `django` | Gunicorn API server on port 8000 (internal) |
| `qcluster` | django-q2 background worker |
| `nginx` | Reverse proxy + SPA, exposed on `HTTP_PORT` (default `8081`) |

On first boot Django will automatically run `migrate`, `collectstatic`, `seed_countries`, and `ensure_superuser`.

## 4 — Open the application

| URL | What you get |
|---|---|
| `http://localhost:8081/cockpit/` | ERS Console (React SPA) |
| `http://localhost:8081/admin/` | Django admin panel |
| `http://localhost:8081/api/schema/swagger-ui/` | Swagger UI (OpenAPI) |
| `http://localhost:8081/api/schema/redoc/` | ReDoc API docs |

Log in with the superuser credentials you set in `.env`.

## 5 — Check service health

```bash
docker compose ps          # all services should show "healthy"
docker compose logs django # tail the API server
docker compose logs qcluster
```

## Stopping and removing data

```bash
docker compose down          # stop but keep volumes (data preserved)
docker compose down -v       # stop and DELETE all volumes (full reset)
```

## Next steps

- Read the [User Guide](/docs/user/) to learn how to create and manage records.
- See the [Architecture Overview](/quickstart/architecture/) for a component diagram.
- See [Docker Deployment](/docs/admin/deployment/) for production configuration.
