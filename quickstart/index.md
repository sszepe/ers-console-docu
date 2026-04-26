---
layout: page
title: Quickstart
permalink: /quickstart/
---

## Prerequisites

- **Docker ≥ 24** and **Docker Compose v2** (`docker compose` without a hyphen)
- Git and a terminal

---

## Step 1 — Clone the repositories

ERS ships as two separate repos combined at deploy time. Clone both side by side:

```bash
git clone -b dev https://github.com/sszepe/django-ers-solution.git
git clone -b dev https://github.com/sszepe/ers-console.git
```

The `django-ers-solution` repo contains the `docker-compose.yml`. The `ers-console` frontend source is expected at `./frontend/`:

```bash
cd django-ers-solution
ln -s ../ers-console frontend   # or: cp -r ../ers-console frontend
```

---

## Step 2 — Create your `.env` file

```bash
cp .env.example .env
```

Open `.env` and set **at minimum** the two required secrets:

```bash
DJANGO_SECRET_KEY=<generate: python -c "import secrets; print(secrets.token_urlsafe(50))">
POSTGRES_PASSWORD=your-strong-password
```

All other values have sensible defaults. See [Configuration Reference](/ers-docs/docs/admin/configuration/) for the full list.

<div class="callout callout-tip">
  <span class="callout-title">Auto-create a superuser</span>
  Uncomment and fill in the <code>DJANGO_SUPERUSER_*</code> lines in <code>.env</code> to have the first admin account created automatically on startup — no <code>createsuperuser</code> step needed.
</div>

---

## Step 3 — Start the stack

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

On first boot Django automatically runs `migrate`, `collectstatic`, `seed_countries`, and `ensure_superuser`.

---

## Step 4 — Open the application

| URL | What you get |
|---|---|
| `http://localhost:8081/cockpit/` | ERS Console (React SPA) |
| `http://localhost:8081/admin/` | Django admin panel |
| `http://localhost:8081/api/schema/swagger-ui/` | Swagger UI (OpenAPI) |
| `http://localhost:8081/api/schema/redoc/` | ReDoc API docs |
| `http://localhost:8081/health/` | Health probe |

Log in with the superuser credentials you set in `.env`.

---

## Step 5 — Check service health

```bash
docker compose ps           # all services should show "healthy"
docker compose logs django  # tail the API server
docker compose logs qcluster
```

---

## Stopping and resetting

```bash
docker compose down      # stop, keep volumes (data preserved)
docker compose down -v   # stop and DELETE all volumes (full reset)
```

---

## Architecture overview

```
Browser
  │ :8081
nginx ──── /cockpit/  →  React SPA (baked into image)
       ├── /api/      →  gunicorn (django)
       ├── /admin/    →  gunicorn (django)
       └── /static/   →  collectstatic volume

django (gunicorn, 3 workers)
  └── PostgreSQL 16

qcluster (django-q2)
  └── PostgreSQL 16  (ORM broker — no Redis)
```

See [Architecture Overview](/ers-docs/quickstart/architecture/) for the full breakdown.

---

## Next steps

- [Architecture Overview](/ers-docs/quickstart/architecture/) — detailed component diagram
- [User Guide](/ers-docs/docs/user/) — manage records in the Console
- [Developer Guide](/ers-docs/docs/developer/) — extend and integrate
- [Admin Guide](/ers-docs/docs/admin/) — production deployment
