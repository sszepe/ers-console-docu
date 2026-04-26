---
layout: home
title: Home
---

## Entity Registry System Documentation

![version](https://img.shields.io/badge/django-5.0-0c4b33?logo=django&logoColor=white)
![React](https://img.shields.io/badge/react-18-61dafb?logo=react&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-16-336791?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-compose-2496ed?logo=docker&logoColor=white)

A shared, authoritative registry for **persons**, **organisations**, **places**, and **journals** — built for research information management and CRIS integration. The system consists of a Django 5 REST backend (`django-ers-solution`) and a React/Vite single-page console (`ers-console`).

---

## Get Running in 3 Commands

```bash
# 1. Clone both repos
git clone -b dev https://github.com/sszepe/django-ers-solution.git
git clone -b dev https://github.com/sszepe/ers-console.git
cd django-ers-solution && ln -s ../ers-console frontend

# 2. Configure secrets
cp .env.example .env
# Edit .env: set DJANGO_SECRET_KEY and POSTGRES_PASSWORD

# 3. Start the full stack
docker compose up -d
```

Then open **[http://localhost:8081/cockpit/](http://localhost:8081/cockpit/)** → log in → done.

See the full [Quickstart](/ers-docs/quickstart/) for step-by-step instructions.

---

## What's in the stack?

<div class="service-grid">
  <div class="service-card">
    <h4>nginx</h4>
    <p>Reverse proxy serving the SPA, static files, and proxying API calls to gunicorn.</p>
    <span class="port">:8081</span>
  </div>
  <div class="service-card">
    <h4>ERS Console</h4>
    <p>React/Vite SPA baked into the nginx image. Hash-routed, no server-side rendering.</p>
    <a href="/ers-docs/docs/developer/frontend/">Frontend docs →</a>
  </div>
  <div class="service-card">
    <h4>Django / gunicorn</h4>
    <p>DRF REST API with OpenAPI schema, session auth, object-level permissions.</p>
    <a href="/ers-docs/docs/developer/backend/">Backend docs →</a>
  </div>
  <div class="service-card">
    <h4>qcluster</h4>
    <p>django-q2 background worker — ROR/ORCID imports, GeoNames sync. No Redis needed.</p>
    <a href="/ers-docs/docs/developer/background-tasks/">Task docs →</a>
  </div>
  <div class="service-card">
    <h4>PostgreSQL 16</h4>
    <p>Sole data store — relational data, task queue, version history, audit log.</p>
    <a href="/ers-docs/docs/admin/database/">DB docs →</a>
  </div>
  <div class="service-card">
    <h4>OpenAPI / Swagger</h4>
    <p>Auto-generated schema from drf-spectacular. Interactive Swagger UI and ReDoc.</p>
    <a href="/ers-docs/docs/developer/api/">API docs →</a>
  </div>
</div>

---

## Entity types

| Entity | Key identifiers | Notes |
|---|---|---|
| **Person** | ORCID, ISNI, GND, Wikidata, OpenAlex | Multiple name variants, affiliation history |
| **Organisation** | ROR, GRID, ISNI, GND, Wikidata, OpenAlex, FundRef | Hierarchical via Organigrams |
| **Organigram** | UUID, slug | Named org chart per institution (admin / research / governance…) |
| **Affiliation** | — | Person ↔ Organisation, date-ranged, role-typed |
| **Journal** | ISSN, eISSN, OpenAlex | Authority list for publication metadata |
| **Country / City** | ISO 3166, GeoNames | Seeded from GeoNames; linked to Persons & Orgs |

---

## Key features

- **Import provenance** — every imported field tracks its source, import timestamp, and payload hash (SHA-256 deduplication). Fields can be locked against re-import.
- **Review workflow** — configurable `ReviewPolicy` rules assign statuses (`DRAFT → REVIEW_REQUIRED → APPROVED / REJECTED`) automatically based on entity type, field values, and operators.
- **Audit trail** — `AuditRequestMiddleware` logs every mutating request; `django-reversion` snapshots full model versions for rollback.
- **Background tasks** — `django-q2` with ORM broker. No Redis, no Celery. Configurable worker count via `Q_WORKERS`.
- **Object-level permissions** — `django-guardian` for per-record `view / change / delete` grants per user or group.

---

## Documentation sections

<div class="service-grid">
  <div class="service-card">
    <h4>🚀 Quickstart</h4>
    <p>Clone, configure, and run the full stack with Docker Compose.</p>
    <a href="/ers-docs/quickstart/">Read →</a>
  </div>
  <div class="service-card">
    <h4>📋 User Guide</h4>
    <p>Browse, search, import, and review records in the ERS Console.</p>
    <a href="/ers-docs/docs/user/">Read →</a>
  </div>
  <div class="service-card">
    <h4>⚙️ Developer Guide</h4>
    <p>API reference, data model, frontend architecture, background tasks.</p>
    <a href="/ers-docs/docs/developer/">Read →</a>
  </div>
  <div class="service-card">
    <h4>🛡️ Admin Guide</h4>
    <p>Deployment, configuration, user management, review policies.</p>
    <a href="/ers-docs/docs/admin/">Read →</a>
  </div>
</div>

---

## Repositories

| Repo | Branch | Purpose |
|---|---|---|
| [`sszepe/django-ers-solution`](https://github.com/sszepe/django-ers-solution/tree/dev) | `dev` | Django backend, Docker Compose, nginx |
| [`sszepe/ers-console`](https://github.com/sszepe/ers-console/tree/dev) | `dev` | React / Vite / TypeScript frontend |
