---
layout: doc
title: Architecture Overview
description: How the four Docker services fit together and how data flows through ERS.
section: Getting Started
permalink: /quickstart/architecture/
---

## Component Overview

ERS is composed of four Docker services orchestrated by a single `docker-compose.yml`:

```
┌─────────────────────────────────────────────────────────────┐
│                          Browser                            │
└──────────────────────┬──────────────────────────────────────┘
                       │ :8081 (HTTP_PORT)
┌──────────────────────▼──────────────────────────────────────┐
│                        nginx                                │
│  /cockpit/  →  React SPA (static, built into image)         │
│  /api/      →  proxy → django:8000                          │
│  /admin/    →  proxy → django:8000                          │
│  /static/   →  volume (ManifestStaticFilesStorage)          │
│  /media/    →  volume                                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  django (gunicorn)                          │
│  3 sync workers · port 8000 (internal only)                 │
│  Apps: accounts · agents · places · journals                │
│        audit · review · api                                 │
└────────────┬──────────────────────────────────┬────────────┘
             │                                  │
┌────────────▼────────────┐       ┌─────────────▼────────────┐
│       PostgreSQL 16      │       │    qcluster (django-q2)  │
│    ersregistry database  │       │  Background tasks:       │
│    (shared volume)       │◄──────│  · ROR → Places sync     │
└─────────────────────────┘       │  · Scheduled imports     │
                                  └──────────────────────────┘
```

## Request flow

1. The browser loads the React SPA from `nginx` at `/cockpit/`.
2. The SPA makes AJAX calls to `/api/v1/` — nginx proxies these to the `django` gunicorn server.
3. Django authenticates the request via session cookie (set by `/accounts/login/`), applies object-level permissions (django-guardian), and returns JSON.
4. Long-running operations (external API lookups, bulk imports) are enqueued as django-q2 tasks and executed by `qcluster` out of band.

## Django app layout

| App | Responsibility |
|---|---|
| `apps.accounts` | Extended `UserProfile` (JSON extra_data), custom `UserAdmin` |
| `apps.agents` | Person, Organisation, Organigram, OrgNode, OrgUnitFunction, PersonAffiliation |
| `apps.places` | Country, City (GeoNames-seeded) |
| `apps.journals` | Journal entity with PIDs |
| `apps.audit` | Per-request audit middleware, AuditLog model, `AuditAdminMixin` |
| `apps.review` | ReviewPolicy engine, ObjectReviewState FSM, ReviewTransition history |
| `apps.api` | DRF ViewSets, serializers, URL routing, `type_config` system |

## Frontend (ERS Console)

The `ers-console` repo is a Vite + React + TypeScript SPA. During the Docker build, `npm run build` compiles it to `/app/frontend/dist` which is then baked into the `nginx` image. The SPA is entirely hash-routed (no server-side routing required).

Pages: Persons · Organisations · Organigrams · Affiliations · Journals · Places · Imports · Configs · Audit · Review

## Data storage

- **PostgreSQL 16** (`postgres_data` volume) — all relational data.
- **django_static** volume — collectstatic output served by nginx with 1-year immutable cache headers.
- **django_media** volume — user-uploaded files (served with 7-day cache).
- **django-q2 ORM broker** — task queue stored in the same PostgreSQL database; no Redis required.
