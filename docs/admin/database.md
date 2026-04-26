---
layout: page
title: Database & Migrations
permalink: /docs/admin/database/
---

## Initial setup

`init-db/01-init-user.sh` runs automatically when the `db` container starts with an empty data directory. It creates the role and database idempotently:

```bash
CREATE ROLE "ersregistry" LOGIN PASSWORD '…';
CREATE DATABASE "ersregistry" OWNER "ersregistry";
GRANT ALL PRIVILEGES ON DATABASE "ersregistry" TO "ersregistry";
```

---

## Running migrations

Migrations run automatically on startup. To run manually:

```bash
docker compose exec django python manage.py migrate

# Check pending without applying:
docker compose exec django python manage.py showmigrations
```

---

## Creating new migrations (development)

```bash
docker compose exec django python manage.py makemigrations
# or targeted:
python manage.py makemigrations apps.myapp
```

Always review generated migrations before committing. Squash long migration chains when needed.

---

## Backup

```bash
# Full dump
docker compose exec db pg_dump -U ersregistry ersregistry > backup_$(date +%Y%m%d).sql

# Restore
docker compose exec -T db psql -U ersregistry ersregistry < backup_20250115.sql
```

---

## Media files

Back up the `django_media` Docker volume separately:

```bash
docker run --rm -v django_media:/data -v $(pwd):/backup alpine \
  tar czf /backup/media_$(date +%Y%m%d).tar.gz -C /data .
```

---

## Connection pooling

Django uses one database connection per gunicorn worker (3 by default). For higher loads, add PgBouncer in front of PostgreSQL or switch to `django-db-geventpool`.

<div class="page-nav">
  <a href="/ers-docs/docs/admin/configuration/">← Configuration Reference</a>
  <a href="/ers-docs/docs/admin/users/">User Management →</a>
</div>
