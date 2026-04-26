---
layout: doc
title: Audit System
description: How the audit middleware and AuditAdminMixin work.
section: Developer Guide
permalink: /docs/developer/audit/
---

## Components

The audit system has three parts:

1. **`AuditRequestMiddleware`** — records every mutating HTTP request to `AuditLog`.
2. **`AuditAdminMixin`** — adds audit-aware `readonly_fields` and display to Django admin classes.
3. **`CurrentUserSignalMiddleware`** — stores the current user in a thread-local for use in model signals.

## AuditRequestMiddleware

Sits in `MIDDLEWARE` after authentication. For every request with a mutating method (`POST`, `PUT`, `PATCH`, `DELETE`):

1. Extracts `request.user` (may be anonymous).
2. After the response is generated, creates an `AuditLog` entry with:
   - `user` — the authenticated user (or `None`)
   - `method` — HTTP method
   - `path` — request path
   - `status_code` — response status
   - `object_type` — inferred from path (best-effort, GenericFK)
   - `object_id` — extracted from path or response body
   - `changes` — JSON diff (for `PATCH`/`PUT` if body is parseable JSON)

## AuditAdminMixin

Apply to any `ModelAdmin` class to automatically:

- Add `created_at`, `updated_at`, `created_by`, `updated_by` to `readonly_fields`.
- Display the audit history inline in the change view.

```python
from apps.audit.admin import AuditAdminMixin

@admin.register(MyModel)
class MyModelAdmin(AuditAdminMixin, admin.ModelAdmin):
    …
```

## CurrentUserSignalMiddleware

Stores `request.user` in a module-level thread-local (`_thread_locals.user`). Use the helper function in signals or model `save()` methods when you need to attribute a change to the current HTTP user without passing the request explicitly:

```python
from apps.api.middleware import get_current_user

class MyModel(models.Model):
    def save(self, *args, **kwargs):
        if not self.pk:
            self.created_by = get_current_user()
        self.updated_by = get_current_user()
        super().save(*args, **kwargs)
```

## django-reversion integration

Models decorated with `@reversion.register()` get automatic version snapshots on every save:

```python
import reversion

@reversion.register()
class Person(models.Model):
    …
```

To access version history programmatically:

```python
from reversion.models import Version

versions = Version.objects.get_for_object(person_instance)
for v in versions:
    print(v.revision.date_created, v.field_dict)
```

Version rollback is available through the Django admin's history view.
