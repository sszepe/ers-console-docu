---
layout: doc
title: Database & Migrations
description: PostgreSQL setup, running migrations, and backup procedures.
section: Admin Guide
permalink: /docs/admin/database/
---

## Initial setup

The `init-db/01-init-user.sh` script runs automatically when the `db` container starts with an empty data directory. It creates the `ersregistry` role and database idempotently:

```bash
CREATE ROLE "ersregistry" LOGIN PASSWORD '…';
CREATE DATABASE "ersregistry" OWNER "ersregistry";
GRANT ALL PRIVILEGES ON DATABASE "ersregistry" TO "ersregistry";
```

This is safe to re-run — the script checks for role and database existence before creating.

## Running migrations

Migrations run automatically on `django` container startup. To run them manually:

```bash
docker compose exec django python manage.py migrate
```

To check pending migrations without applying:

```bash
docker compose exec django python manage.py showmigrations
```

## Creating new migrations (development)

```bash
docker compose exec django python manage.py makemigrations
# or locally:
python manage.py makemigrations apps.myapp
```

Always review generated migrations before committing. Squash when a migration chain becomes long.

## Backup

```bash
# Full PostgreSQL dump
docker compose exec db pg_dump -U ersregistry ersregistry > backup_$(date +%Y%m%d).sql

# Restore from dump
docker compose exec -T db psql -U ersregistry ersregistry < backup_20241201.sql
```

For automated backups, mount a backup script into the `db` container's cron or use a dedicated backup service (e.g. `prodrigestivill/postgres-backup-local`).

## Media files

Media files (user uploads) are stored in the `django_media` Docker volume. Back up this volume separately:

```bash
docker run --rm -v django_media:/data -v $(pwd):/backup alpine \
  tar czf /backup/media_backup_$(date +%Y%m%d).tar.gz -C /data .
```

## Connection pool

Django uses one database connection per gunicorn worker (3 by default). For higher loads, add `django-db-geventpool` or use PgBouncer as a connection pool in front of PostgreSQL.
