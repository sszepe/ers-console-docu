---
layout: doc
title: Review Engine
description: How the ReviewPolicy engine evaluates rules and sets ObjectReviewState.
section: Developer Guide
permalink: /docs/developer/review-engine/
---

## Architecture

The review system consists of three models:

- **`ReviewPolicy`** — a rule that matches a condition on an entity and assigns a resulting status.
- **`ObjectReviewState`** — the current review state of a specific object instance (via Django's GenericForeignKey).
- **`ReviewTransition`** — an immutable log of every status change with actor and comment.

## Policy evaluation

When `set_review_state()` is called (from a signal, ViewSet, or management command), the engine:

1. Loads all active `ReviewPolicy` objects for the entity type, ordered by `priority` (lowest first).
2. Evaluates each policy's condition against the object's field/JSON path.
3. The **first matching policy** wins. Its `resulting_status` is assigned to the `ObjectReviewState`.
4. If no policy matches, the object stays in `DRAFT`.
5. A `ReviewTransition` record is created for the change.

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

## Field path resolution

`field_path` supports:
- Simple field names: `"org_type"`, `"is_active"`
- Dot-notation JSON paths: `"external_ids.kind"`, `"country.code"`
- Nested attribute traversal on related objects: `"country.iso_code"`

Empty `field_path` with operator `always` matches any record of the entity type.

## Calling the engine

```python
from apps.review.services import set_review_state
from apps.review.models import ReviewStatus

# Called after saving an Organisation:
state = set_review_state(
    obj=organisation_instance,
    status=ReviewStatus.REVIEW_REQUIRED,  # fallback if no policy matches
    actor=request.user,
    reason="Imported from ROR",
    metadata={"source": "ror_import"},
)
```

## API transitions

The `POST /api/v1/review/states/{id}/transition/` endpoint lets authorised users trigger manual transitions:

```json
{
  "status": "APPROVED",
  "comment": "Verified against university website."
}
```

The transition is validated (only valid `ReviewStatus` values accepted), and a `ReviewTransition` record is created. The `decided_by` and `decided_at` fields on `ObjectReviewState` are updated for terminal decisions (`APPROVED`, `REJECTED`, `MANUALLY_CONFIRMED`).

## Signals integration

Wire up automatic review evaluation in a model's `post_save` signal:

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
        actor=None,   # system action
        reason="auto" if not created else "initial",
    )
```
