---
layout: page
title: Developer Guide
permalink: /docs/developer/
---

## Repositories

| Repo | Branch | Purpose |
|---|---|---|
| [`sszepe/django-ers-solution`](https://github.com/sszepe/django-ers-solution/tree/dev) | `dev` | Django backend, Docker Compose, nginx |
| [`sszepe/ers-console`](https://github.com/sszepe/ers-console/tree/dev) | `dev` | React / Vite / TypeScript frontend |

---

## Technology stack

**Backend:** Python 3.12+ · Django 5.0 · Django REST Framework 3.15 · drf-spectacular · django-guardian · django-reversion · django-q2 · PostgreSQL 16

**Frontend:** React 18 · TypeScript · Vite · TanStack Query · Hash routing · CSS custom properties

---

## Local development setup

### Backend only (no Docker)

```bash
cd django-ers-solution
python -m venv .venv && source .venv/bin/activate
pip install -r django/requirements.txt
export DJANGO_SETTINGS_MODULE=ersregistry.settings.development
cd django
python manage.py migrate
python manage.py seed_countries
python manage.py createsuperuser
python manage.py runserver
```

The development settings fall back to SQLite when `POSTGRES_HOST` is not set — no database setup needed for a quick local run.

### Frontend only

```bash
cd ers-console
npm install
npm run dev   # Vite dev server on http://localhost:5173
```

Set `VITE_API_BASE_URL=http://localhost:8000` in a `.env.local` file to point the frontend at your local Django server.

### Full stack with Docker

See the [Quickstart](/ers-docs/quickstart/).

---

## Sections

- [Django Backend](/ers-docs/docs/developer/backend/)
- [REST API Reference](/ers-docs/docs/developer/api/)
- [ERS Console (Frontend)](/ers-docs/docs/developer/frontend/)
- [Data Model](/ers-docs/docs/developer/data-model/)
- [Background Tasks](/ers-docs/docs/developer/background-tasks/)
- [Review Engine](/ers-docs/docs/developer/review-engine/)
- [Audit System](/ers-docs/docs/developer/audit/)
