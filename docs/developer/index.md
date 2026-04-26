---
layout: doc
title: Developer Guide
description: Technical reference for backend and frontend development on ERS.
section: Developer Guide
permalink: /docs/developer/
---

This guide covers everything you need to extend or integrate with ERS as a developer.

## Repositories

| Repo | Branch | Purpose |
|---|---|---|
| [`sszepe/django-ers-solution`](https://github.com/sszepe/django-ers-solution/tree/dev) | `dev` | Django backend, docker-compose, nginx |
| [`sszepe/ers-console`](https://github.com/sszepe/ers-console/tree/dev) | `dev` | React / Vite / TypeScript frontend |

## Technology stack

**Backend:**
- Python 3.12+ / Django 5.0
- Django REST Framework 3.15 + drf-spectacular (OpenAPI 3)
- django-guardian (object-level permissions)
- django-reversion (model version history)
- django-q2 (background tasks, ORM broker)
- django-filter + DRF Search/Ordering filters
- PostgreSQL 16

**Frontend:**
- React 18 + TypeScript
- Vite build tooling
- TanStack Query (server state)
- Hash-based routing (no React Router)
- CSS custom properties (no CSS framework)

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

The development settings fall back to SQLite when `POSTGRES_HOST` is not set, so no database setup is needed for a quick local run.

### Frontend only

```bash
cd ers-console
npm install
npm run dev   # Vite dev server on http://localhost:5173
```

Set `VITE_API_BASE_URL=http://localhost:8000` in a `.env.local` file to point the dev frontend at your local Django server.

### Full stack with Docker

See the [Quickstart](/quickstart/).

## Sections

- [Django Backend](/docs/developer/backend/)
- [REST API Reference](/docs/developer/api/)
- [ERS Console Frontend](/docs/developer/frontend/)
- [Data Model](/docs/developer/data-model/)
- [Background Tasks](/docs/developer/background-tasks/)
- [Review Engine](/docs/developer/review-engine/)
- [Audit System](/docs/developer/audit/)
