---
layout: doc
title: Monitoring & Logs
description: Log configuration, health checks, and operational monitoring for ERS.
section: Admin Guide
permalink: /docs/admin/monitoring/
---

## Health check

ERS exposes a lightweight health probe at `/health/`. This endpoint proxies to `django:8000/api/schema/` and returns HTTP 200 when the Django service is alive.

```bash
curl -o /dev/null -s -w "%{http_code}" http://localhost:8081/health/
# → 200
```

Docker Compose uses this for the nginx health check. You can point an external monitoring tool (Uptime Robot, Prometheus `blackbox_exporter`, etc.) at this URL.

## Log configuration

Logs are written to **stdout/stderr** from all services. Collect them with Docker's log driver or a log aggregator.

### Log levels

Control log verbosity via `.env`:

| Variable | Default | Controls |
|---|---|---|
| `DJANGO_LOG_LEVEL` | `WARNING` | Django framework internals (`django.*` logger) |
| `APP_LOG_LEVEL` | `INFO` | Application code (`apps.*` logger) |

Set to `DEBUG` for troubleshooting (very verbose — do not use in production long-term).

### Log format (production)

Production logs use a structured JSON format:

```json
{"time":"2025-01-15 12:34:56,789","level":"INFO","name":"apps.agents","msg":"Person 42 updated"}
```

Parse with any JSON-aware log aggregator (Loki, Elasticsearch, Splunk, etc.).

### Tailing logs

```bash
docker compose logs -f django      # API server logs
docker compose logs -f qcluster    # Background task logs
docker compose logs -f nginx       # Access logs
docker compose logs -f db          # PostgreSQL logs
```

## gunicorn metrics

gunicorn logs every request to stdout in Combined Log Format (via `accesslog = "-"`). Access logs include response time. For structured access logging, configure a custom gunicorn `logconfig` or use nginx's access log instead.

## Background task monitoring

Monitor the django-q2 task queue via the Django admin at `/admin/django_q/`:

- **Failed tasks**: check regularly and investigate any recurring failures.
- **Queued tasks**: a growing queue indicates the `qcluster` worker is overloaded — increase `Q_WORKERS`.
- **Scheduled tasks**: verify recurring tasks are running on schedule.

### Alerting on failed tasks

Query `OrmQ` (the django-q2 ORM backend) periodically:

```python
from django_q.models import Failure
recent_failures = Failure.objects.filter(started__gte=threshold).count()
```

Or set up a cron job that queries the database directly and sends an alert if `SELECT COUNT(*) FROM django_q_failure WHERE started > NOW() - INTERVAL '1 hour'` is non-zero.

## Database monitoring

Key queries to watch:

```sql
-- Active connections
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';

-- Long-running queries (> 30s)
SELECT pid, now() - query_start AS duration, query
FROM pg_stat_activity
WHERE state = 'active' AND now() - query_start > interval '30 seconds';

-- Table sizes
SELECT relname, pg_size_pretty(pg_total_relation_size(oid))
FROM pg_class WHERE relkind = 'r'
ORDER BY pg_total_relation_size(oid) DESC LIMIT 20;
```

## Prometheus integration

ERS does not ship a Prometheus exporter by default. To add metrics, install `django-prometheus` and add its URLs and middleware. The nginx and PostgreSQL exporters are also recommended for infrastructure metrics.
