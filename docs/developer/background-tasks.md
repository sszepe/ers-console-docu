---
layout: doc
title: Background Tasks
description: How django-q2 is configured and how to add new background tasks.
section: Developer Guide
permalink: /docs/developer/background-tasks/
---

## Overview

ERS uses **django-q2** for background task execution. Tasks run in the `qcluster` Docker service and use the PostgreSQL database as their message broker — no Redis or other external service is required.

## Configuration

```python
# settings/base.py
Q_CLUSTER = {
    "name": "ersregistry",
    "workers": 2,         # parallel task workers (override with Q_WORKERS env var)
    "timeout": 300,       # seconds before a task is killed
    "retry": 600,         # seconds before a failed task is retried
    "queue_limit": 50,    # max tasks in queue before new ones are rejected
    "bulk": 10,           # batch size for ORM broker polling
    "orm": "default",     # use Django's default DB as broker
    "sync": False,        # set True in tests for synchronous execution
    "catch_up": False,    # don't replay missed scheduled runs on restart
    "max_attempts": 3,    # maximum retry attempts per task
}
```

The `Q_WORKERS` environment variable overrides the `workers` setting in production.

## Monitoring tasks

In the Django admin at `/admin/django_q/`:
- **Tasks** — completed task history with results and timing
- **Failed tasks** — tasks that exhausted retries
- **Queued tasks** — tasks waiting to run
- **Scheduled tasks** — recurring task definitions

## Enqueueing a task

```python
from django_q.tasks import async_task

# Fire and forget
async_task("apps.agents.tasks.sync_ror_places", org_id=42)

# With a hook called after completion
async_task(
    "apps.agents.tasks.import_from_openalex",
    person_id=7,
    hook="apps.api.hooks.log_import_result",
)
```

## Scheduling recurring tasks

Scheduled tasks are configured in the Django admin or via fixtures. Example — run a full ROR sync every night at 02:00:

```python
# Via management command or admin
Schedule.objects.create(
    func="apps.agents.tasks.full_ror_sync",
    schedule_type=Schedule.CRON,
    cron="0 2 * * *",
    repeats=-1,   # indefinitely
)
```

## Writing a new task

Tasks are plain Python callables. Place them in a `tasks.py` module within the relevant app:

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

Tasks should be **idempotent** — they may be retried on failure.
