---
layout: page
title: Audit System
permalink: /docs/developer/audit/
---

## Components

| Component | Role |
|---|---|
| `AuditRequestMiddleware` | Records every mutating HTTP request to `AuditLog` |
| `AuditAdminMixin` | Adds audit-aware `readonly_fields` and display to Django admin classes |
| `CurrentUserSignalMiddleware` | Stores current user in thread-local for model signals |

---

## AuditRequestMiddleware

For every `POST`, `PUT`, `PATCH`, or `DELETE` request, after the response is generated, creates an `AuditLog` entry with:

- `user` — authenticated user (or `None` for anonymous)
- `method` — HTTP method
- `path` — request path
- `status_code` — response status
- `object_type` — inferred from path (GenericFK, best-effort)
- `object_id` — extracted from path or response body
- `changes` — JSON diff for `PATCH`/`PUT` when body is parseable JSON

---

## AuditAdminMixin

```python
from apps.audit.admin import AuditAdminMixin

@admin.register(MyModel)
class MyModelAdmin(AuditAdminMixin, admin.ModelAdmin):
    …
```

Automatically adds `created_at`, `updated_at`, `created_by`, `updated_by` to `readonly_fields` and shows the audit history inline on the change view.

---

## CurrentUserSignalMiddleware

Stores `request.user` in a module-level thread-local. Use `get_current_user()` in signals or model `save()` methods:

```python
from apps.api.middleware import get_current_user

class MyModel(models.Model):
    def save(self, *args, **kwargs):
        if not self.pk:
            self.created_by = get_current_user()
        self.updated_by = get_current_user()
        super().save(*args, **kwargs)
```

---

## django-reversion integration

Decorate models for full version history:

```python
import reversion

@reversion.register()
class Person(models.Model):
    …
```

Access version history programmatically:

```python
from reversion.models import Version

versions = Version.objects.get_for_object(person_instance)
for v in versions:
    print(v.revision.date_created, v.field_dict)
```

Version rollback is available through the Django admin history view. Registered models: `Person`, `Organisation`, `Organigram`, `OrgNode`, `OrgUnitFunction`.

<div class="page-nav">
  <a href="/ers-docs/docs/developer/review-engine/">← Review Engine</a>
  <a href="/ers-docs/docs/admin/">Admin Guide →</a>
</div>
