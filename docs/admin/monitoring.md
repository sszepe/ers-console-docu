---
layout: page
title: Monitoring & Logs
permalink: /docs/admin/monitoring/
---

## Health check

ERS exposes a health probe at `/health/` (proxied to `django:8000/api/schema/`). Returns HTTP 200 when Django is alive.

```bash
curl -o /dev/null -s -w "%{http_code}" http://localhost:8081/health/
# → 200
```

Point Uptime Robot, Prometheus `blackbox_exporter`, or any HTTP monitor at this URL.

---

## Log configuration

Logs go to **stdout/stderr** from all services. Collect with Docker's log driver or a log aggregator (Loki, Elasticsearch, CloudWatch…).

### Log levels

| Variable | Default | Controls |
|---|---|---|
| `DJANGO_LOG_LEVEL` | `WARNING` | Django framework internals (`django.*`) |
| `APP_LOG_LEVEL` | `INFO` | Application code (`apps.*`) |

Set to `DEBUG` for troubleshooting — very verbose, do not use long-term in production.

### Production log format (JSON)

```json
{"time":"2025-01-15 12:34:56,789","level":"INFO","name":"apps.agents","msg":"Person 42 updated"}
```

### Tailing logs

```bash
docker compose logs -f django      # API server
docker compose logs -f qcluster    # background tasks
docker compose logs -f nginx       # access log
docker compose logs -f db          # PostgreSQL
```

---

## Background task monitoring

In Django admin at `/admin/django_q/`:

- **Failed tasks** — check regularly; recurring failures indicate a configuration or network problem
- **Queued tasks** — a growing queue means `qcluster` is overloaded; increase `Q_WORKERS`
- **Scheduled tasks** — verify recurring tasks are running on schedule

### Alert on failed tasks

```sql
-- Query directly against PostgreSQL
SELECT COUNT(*) FROM django_q_failure
WHERE started > NOW() - INTERVAL '1 hour';
```

---

## Database monitoring

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

---

## Prometheus integration

ERS does not ship a Prometheus exporter by default. To add metrics, install `django-prometheus` and add its middleware and URLs. The standard nginx and PostgreSQL exporters are also recommended for infrastructure metrics.

<div class="page-nav">
  <a href="/ers-docs/docs/admin/review-policies/">← Review Policies</a>
</div>
