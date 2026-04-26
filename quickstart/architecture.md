---
layout: page
title: Architecture Overview
permalink: /quickstart/architecture/
---

## Component diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                            Browser                              │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP_PORT (default 8081)
┌────────────────────────────▼────────────────────────────────────┐
│                           nginx                                 │
│   /cockpit/   →  React SPA (static, baked into image)           │
│   /assets/    →  Vite chunks (1yr immutable cache)              │
│   /static/    →  Django collectstatic volume (1yr cache)        │
│   /media/     →  Django media volume (7d cache)                 │
│   /api/       →  proxy → django:8000                            │
│   /accounts/  →  proxy → django:8000                            │
│   /admin/     →  proxy → django:8000                            │
│   /health/    →  proxy → django:8000/api/schema/                │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                  django (gunicorn, 3 sync workers)              │
│                          port 8000 (internal only)             │
│                                                                 │
│   apps.accounts  │  apps.agents   │  apps.places               │
│   apps.journals  │  apps.audit    │  apps.review               │
│                  apps.api                                       │
└──────────────┬──────────────────────────────┬───────────────────┘
               │                              │
┌──────────────▼───────────┐    ┌─────────────▼────────────────┐
│      PostgreSQL 16        │    │   qcluster (django-q2)       │
│   (postgres_data volume)  │◄───│   Background tasks:          │
│                           │    │   · ROR → Places sync        │
│   Shared by django        │    │   · ORCID / OpenAlex import  │
│   and qcluster            │    │   · GeoNames city sync       │
└───────────────────────────┘    └──────────────────────────────┘
```

---

## Request flow

<ol class="steps">
  <li><div><strong>Browser loads the SPA</strong> — nginx serves <code>index.html</code> from <code>/cockpit/</code>. Vite-hashed JS/CSS chunks are cached for 1 year.</div></li>
  <li><div><strong>SPA makes API calls</strong> — all <code>/api/v1/*</code> requests go to nginx, which proxies them to <code>django:8000</code>.</div></li>
  <li><div><strong>Django authenticates</strong> — session cookie set by <code>/accounts/login/</code>. Object-level permissions checked via django-guardian.</div></li>
  <li><div><strong>Background work is queued</strong> — import tasks, GeoNames lookups, and ROR syncs are enqueued as django-q2 tasks and run by <code>qcluster</code> out of band.</div></li>
</ol>

---

## Docker Compose services

| Service | Image | Internal port | Exposed |
|---|---|---|---|
| `db` | `postgres:16-alpine` | 5432 | No |
| `django` | Custom (gunicorn) | 8000 | No |
| `qcluster` | Same as django | — | No |
| `nginx` | Custom (nginx 1.27 + SPA) | 80 | `HTTP_PORT` (default 8081) |

**Startup order:** `db` → `django` (waits for `db` healthy) → `qcluster` (waits for `django` healthy) → `nginx` (waits for `django` healthy)

---

## Django app layout

| App | Key responsibility |
|---|---|
| `apps.accounts` | `UserProfile` extending Django's `User` with JSON `extra_data` |
| `apps.agents` | `Person`, `Organisation`, `Organigram`, `OrgNode`, `OrgUnitFunction`, `PersonAffiliation`, `PersonName` |
| `apps.places` | `Country`, `City` — seeded from GeoNames |
| `apps.journals` | `Journal` entity with PIDs (ISSN, eISSN, OpenAlex) |
| `apps.audit` | `AuditLog`, `AuditRequestMiddleware`, `AuditAdminMixin` |
| `apps.review` | `ReviewPolicy` engine, `ObjectReviewState` FSM, `ReviewTransition` history |
| `apps.api` | DRF ViewSets, serializers, URL router, `type_config` controlled vocabulary |

---

## Volumes

| Volume | Contents | Used by |
|---|---|---|
| `postgres_data` | PostgreSQL data directory | `db` |
| `django_static` | `collectstatic` output | `django` (write), `nginx` (read-only) |
| `django_media` | User-uploaded files | `django` (write), `nginx` (read-only), `qcluster` (read) |

---

## nginx routing table

| Path pattern | Served from |
|---|---|
| `/cockpit/` | SPA `index.html` via `try_files` |
| `/assets/` | Vite-hashed chunks from nginx html root (1yr cache) |
| `/static/` | `django_static` volume (1yr immutable cache) |
| `/media/` | `django_media` volume (7d cache) |
| `~ ^/(api\|accounts\|admin)/` | Proxied to `django:8000` |
| `/health/` | Proxied to `django:8000/api/schema/` |
| `/` | 302 redirect to `/cockpit/` |
