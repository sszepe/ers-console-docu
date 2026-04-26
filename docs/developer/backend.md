---
layout: page
title: Django Backend
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

---

## Settings structure

| Module | When used |
|---|---|
| `ersregistry.settings.base` | Never directly — imported by all others |
| `ersregistry.settings.development` | Local dev (`DEBUG=True`, SQLite fallback when no `POSTGRES_HOST`) |
| `ersregistry.settings.production` | Docker/production — all config from env vars |
| `ersregistry.settings.build` | Docker build stage — `collectstatic` without a DB connection |

---

## Installed apps

### Third-party

| Package | Role |
|---|---|
| `rest_framework` | DRF — serializers, ViewSets, authentication |
| `django_filters` | URL-parameter filtering for list endpoints |
| `drf_spectacular` | Auto-generates OpenAPI 3 schema |
| `corsheaders` | CORS headers (controlled by `CORS_ALLOWED_ORIGINS`) |
| `guardian` | Object-level permissions per record |
| `django_q` | django-q2 task queue (ORM broker) |
| `reversion` | Full version history for decorated models |

### Local apps

| App | Key models |
|---|---|
| `apps.accounts` | `UserProfile` extending `User` with JSON `extra_data` |
| `apps.agents` | `Person`, `Organisation`, `Organigram`, `OrgNode`, `OrgUnitFunction`, `PersonAffiliation`, `PersonName` |
| `apps.places` | `Country`, `City` |
| `apps.journals` | `Journal` |
| `apps.audit` | `AuditLog`, middleware, `AuditAdminMixin` |
| `apps.review` | `ReviewPolicy`, `ObjectReviewState`, `ReviewTransition` |
| `apps.api` | DRF ViewSets, serializers, URL router, `type_config` |

---

## URL structure

```
/admin/                       Django admin
/accounts/                    Django auth (login, logout, password)
/api/schema/                  OpenAPI schema (JSON/YAML)
/api/schema/swagger-ui/       Swagger UI
/api/schema/redoc/            ReDoc
/api/v1/                      REST API — all entity endpoints
```

---

## Authentication

`SessionAuthentication` + `BasicAuthentication` (fallback). Default permission: `IsAuthenticatedOrReadOnly` — unauthenticated users can read; authenticated users can write (subject to object-level Guardian permissions).

---

## Custom middleware

| Middleware | Role |
|---|---|
| `apps.api.middleware.CurrentUserSignalMiddleware` | Stores current request user in thread-local for model signals |
| `apps.audit.middleware.AuditRequestMiddleware` | Records every mutating request to `AuditLog` |

---

## gunicorn configuration

```python
# gunicorn_conf.py
bind         = "0.0.0.0:8000"
workers      = 3
worker_class = "sync"
timeout      = 120
keepalive    = 5
accesslog    = "-"
errorlog     = "-"
loglevel     = "info"
```

---

## Adding a new app

1. `python manage.py startapp myapp apps/myapp`
2. Add `"apps.myapp"` to `LOCAL_APPS` in `settings/base.py`
3. Register models in `admin.py` using `AuditAdminMixin`
4. Create serializers and ViewSet in `apps/api/`
5. Wire ViewSet into `apps/api/urls.py` via the DRF Router
6. `python manage.py makemigrations myapp`

<div class="page-nav">
  <a href="/ers-docs/docs/developer/">← Developer Overview</a>
  <a href="/ers-docs/docs/developer/api/">REST API Reference →</a>
</div>
