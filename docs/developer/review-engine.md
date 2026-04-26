---
layout: page
title: Review Engine
permalink: /docs/developer/review-engine/
---

## Architecture

Three models work together:

| Model | Role |
|---|---|
| `ReviewPolicy` | Rule that matches a condition on an entity and assigns a resulting status |
| `ObjectReviewState` | Current review state of a specific object instance (via GenericFK) |
| `ReviewTransition` | Immutable log of every status change — actor, from/to status, comment, timestamp |

---

## Policy evaluation

When `set_review_state()` is called, the engine:

<ol class="steps">
  <li><div>Loads all active <code>ReviewPolicy</code> objects for the entity type, ordered by <code>priority</code> (lowest first).</div></li>
  <li><div>Evaluates each policy's condition against the object's field or JSON path.</div></li>
  <li><div>The <strong>first matching policy wins</strong> — its <code>resulting_status</code> is assigned to <code>ObjectReviewState</code>.</div></li>
  <li><div>If no policy matches, the object stays in its current status (or <code>DRAFT</code> if new).</div></li>
  <li><div>A <code>ReviewTransition</code> record is created for the change.</div></li>
</ol>

---

## Operators

| Operator | Behaviour |
|---|---|
| `always` | Matches unconditionally |
| `exact` | `field_value == policy.value` |
| `not_exact` | `field_value != policy.value` |
| `in` | `field_value in policy.value` (list) |
| `not_in` | `field_value not in policy.value` |
| `contains` | `policy.value in field_value` (substring or list contains) |
| `is_empty` | Field is `None`, `""`, `[]`, or `{}` |
| `is_not_empty` | Inverse of above |
| `regex` | `re.search(policy.value, str(field_value))` |

---

## Field path resolution

`field_path` supports:
- Simple field names: `"org_type"`, `"is_active"`
- Dot-notation JSON paths: `"external_ids.kind"`, `"country.code"`
- Nested attribute traversal: `"country.iso_code"`

Empty `field_path` with operator `always` matches any record of the entity type.

---

## Calling the engine

```python
from apps.review.services import set_review_state
from apps.review.models import ReviewStatus

state = set_review_state(
    obj=organisation_instance,
    status=ReviewStatus.REVIEW_REQUIRED,  # fallback if no policy matches
    actor=request.user,
    reason="Imported from ROR",
    metadata={"source": "ror_import"},
)
```

---

## API transitions

```
POST /api/v1/review/states/{id}/transition/
```

```json
{
  "status": "APPROVED",
  "comment": "Verified against university website."
}
```

The `decided_by` and `decided_at` fields on `ObjectReviewState` are updated for terminal decisions (`APPROVED`, `REJECTED`, `MANUALLY_CONFIRMED`).

---

## Wiring to signals

```python
# apps/agents/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.review.services import set_review_state
from .models import Person

@receiver(post_save, sender=Person)
def evaluate_person_review(sender, instance, created, **kwargs):
    set_review_state(
        instance,
        default_status="DRAFT",
        actor=None,
        reason="auto" if not created else "initial",
    )
```

<div class="page-nav">
  <a href="/ers-docs/docs/developer/background-tasks/">← Background Tasks</a>
  <a href="/ers-docs/docs/developer/audit/">Audit System →</a>
</div>
