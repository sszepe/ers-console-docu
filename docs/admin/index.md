---
layout: doc
title: Admin Guide
description: Deployment, configuration, user management, and operational tasks for ERS administrators.
section: Admin Guide
permalink: /docs/admin/
---

This guide is for system administrators responsible for deploying and operating the Entity Registry System.

## Sections

- [Docker Deployment](/docs/admin/deployment/) — production deployment with Docker Compose
- [Configuration Reference](/docs/admin/configuration/) — all `.env` variables documented
- [Database & Migrations](/docs/admin/database/) — PostgreSQL setup, migrations, backups
- [User Management](/docs/admin/users/) — creating and managing user accounts
- [Django Admin Panel](/docs/admin/django-admin/) — using the built-in admin interface
- [Review Policies](/docs/admin/review-policies/) — configuring the review workflow
- [Monitoring & Logs](/docs/admin/monitoring/) — log configuration and health checks

## Quick reference: admin URLs

| URL | Purpose |
|---|---|
| `/admin/` | Django admin panel |
| `/admin/auth/user/` | User management |
| `/admin/auth/group/` | Group management |
| `/admin/review/reviewpolicy/` | Review policy configuration |
| `/admin/django_q/` | Background task monitoring |
| `/api/schema/swagger-ui/` | Live API documentation |
| `/health/` | Health probe endpoint |

## First-time setup checklist

1. Copy `.env.example` to `.env` and set `DJANGO_SECRET_KEY` and `POSTGRES_PASSWORD`.
2. Configure `ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS` for your domain.
3. Set `DJANGO_SUPERUSER_*` to auto-create the first admin account.
4. Run `docker compose up -d`.
5. Verify all services are healthy: `docker compose ps`.
6. Log in to `/admin/` and create any additional user accounts.
7. Configure Review Policies as needed.
