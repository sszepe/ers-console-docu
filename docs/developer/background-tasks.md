---
layout: page
title: Background Tasks
permalink: /docs/developer/background-tasks/
---

ERS uses **django-q2** for background task execution. Tasks run in the `qcluster` Docker service and use PostgreSQL as their broker — no Redis required.

---

## Configuration

```python
# settings/base.py
Q_CLUSTER = {
    "name":        "ersregistry",
    "workers":     2,        # override with Q_WORKERS env var
    "timeout":     300,      # seconds before task is killed
    "retry":       600,      # seconds before failed task is retried
    "queue_limit": 50,
    "bulk":        10,       # ORM broker polling batch size
    "orm":         "default",
    "sync":        False,    # set True in tests
    "catch_up":    False,    # don't replay missed scheduled runs
    "max_attempts":3,
}
```

---

## Monitoring tasks

In the Django admin at `/admin/django_q/`:

| Section | Contents |
|---|---|
| **Tasks** | Completed task history with results and timing |
| **Failed Tasks** | Tasks that exhausted retries |
| **Queued Tasks** | Tasks waiting to run |
| **Scheduled Tasks** | Recurring task definitions |

---

## Enqueueing a task

```python
from django_q.tasks import async_task

# Fire and forget
async_task("apps.agents.tasks.sync_ror_places", org_id=42)

# With completion hook
async_task(
    "apps.agents.tasks.import_from_openalex",
    person_id=7,
    hook="apps.api.hooks.log_import_result",
)
```

---

## Scheduling recurring tasks

```python
from django_q.models import Schedule

Schedule.objects.create(
    func="apps.agents.tasks.full_ror_sync",
    schedule_type=Schedule.CRON,
    cron="0 2 * * *",   # nightly at 02:00
    repeats=-1,          # indefinitely
)
```

---

## Writing a new task

```python
# apps/agents/tasks.py
import logging
from apps.agents.models import Organisation

logger = logging.getLogger(__name__)

def sync_ror_places(org_id: int) -> str:
    org = Organisation.objects.get(pk=org_id)
    # … fetch from ROR, update Places …
    logger.info("ROR sync complete for org %s", org.registry_id)
    return f"ok:{org.registry_id}"
```

Tasks should be **idempotent** — they may be retried on failure. Keep them focused on a single responsibility and log progress at `INFO` level.

<div class="page-nav">
  <a href="/ers-docs/docs/developer/data-model/">← Data Model</a>
  <a href="/ers-docs/docs/developer/review-engine/">Review Engine →</a>
</div>
