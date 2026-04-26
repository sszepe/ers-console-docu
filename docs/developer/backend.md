---
layout: doc
title: Django Backend
description: Source layout, settings structure, and key patterns used in the Django backend.
section: Developer Guide
permalink: /docs/developer/backend/
---

## Repository layout

```
django-ers-solution/
├── docker-compose.yml
├── .env.example
├── nginx/
│   ├── Dockerfile
│   └── nginx.conf
├── init-db/
│   └── 01-init-user.sh
└── django/
    ├── Dockerfile
    ├── gunicorn_conf.py
    ├── requirements.txt
    ├── wsgi.py
    ├── ersregistry/
    │   ├── urls.py
    │   └── settings/
    │       ├── base.py
    │       ├── development.py
    │       ├── production.py
    │       └── build.py
    └── apps/
        ├── accounts/
        ├── agents/
        ├── places/
        ├── journals/
        ├── audit/
        ├── review/
        └── api/
```

## Settings structure

ERS uses a split settings pattern. The correct module is selected via the `DJANGO_SETTINGS_MODULE` environment variable:

| Module | When used |
|---|---|
| `ersregistry.settings.base` | Never directly — imported by all others |
| `ersregistry.settings.development` | Local development (`DEBUG=True`, SQLite fallback) |
| `ersregistry.settings.production` | Docker / production (`DEBUG=False`, all config from env vars) |
| `ersregistry.settings.build` | Docker build stage only — `collectstatic` without a DB connection |

## Key installed apps

### Third-party

| Package | Role |
|---|---|
| `rest_framework` | DRF — serializers, ViewSets, authentication |
| `django_filters` | URL-parameter filtering for list endpoints |
| `drf_spectacular` | Auto-generates OpenAPI 3 schema from ViewSets |
| `corsheaders` | CORS headers (controlled by `CORS_ALLOWED_ORIGINS`) |
| `guardian` | Object-level permissions (per-record `view`, `change`, `delete`) |
| `django_q` | django-q2 task queue (ORM broker — no Redis needed) |
| `reversion` | Full version history for decorated models |

### Local apps

| App | Key models |
|---|---|
| `apps.accounts` | `UserProfile` (extends `User` with JSON `extra_data`) |
| `apps.agents` | `Person`, `Organisation`, `Organigram`, `OrgNode`, `OrgUnitFunction`, `PersonAffiliation`, `PersonName` |
| `apps.places` | `Country`, `City` |
| `apps.journals` | `Journal` |
| `apps.audit` | `AuditLog`, middleware, `AuditAdminMixin` |
| `apps.review` | `ReviewPolicy`, `ObjectReviewState`, `ReviewTransition` |
| `apps.api` | DRF ViewSets, serializers, URL router, `type_config` |

## URL structure

```
/admin/                          Django admin
/accounts/                       Django auth (login, logout, password change)
/api/schema/                     OpenAPI schema (JSON/YAML)
/api/schema/swagger-ui/          Swagger UI
/api/schema/redoc/               ReDoc
/api/v1/                         REST API (all entity endpoints)
```

## Authentication

The API uses **session authentication** (set via `SessionAuthentication`) plus `BasicAuthentication` as a fallback. Default permission class is `IsAuthenticatedOrReadOnly` — unauthenticated users can read, authenticated users can write (subject to object-level permissions via Guardian).

## Middleware

Two custom middleware classes sit in the stack:

- `apps.api.middleware.CurrentUserSignalMiddleware` — stores the current request user in a thread-local so that model signals can access it without passing the request around.
- `apps.audit.middleware.AuditRequestMiddleware` — records every mutating API request to the `AuditLog`.

## Pagination

Default page size is **20**. The `page_size` query parameter is not exposed by default — override in the ViewSet or add `PAGE_SIZE_QUERY_PARAM` to `REST_FRAMEWORK` if needed.

## Adding a new app

1. Create the app under `apps/`:
   ```bash
   python manage.py startapp myapp apps/myapp
   ```
2. Add `"apps.myapp"` to `LOCAL_APPS` in `settings/base.py`.
3. Register models in `apps/myapp/admin.py` using `AuditAdminMixin` for automatic audit integration.
4. Create serializers and a ViewSet in `apps/api/` or within the app.
5. Wire the ViewSet into `apps/api/urls.py` via the DRF Router.
6. Run `python manage.py makemigrations myapp`.
