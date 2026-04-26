---
layout: page
title: Review Policies
permalink: /docs/admin/review-policies/
---

Review Policies are rules that automatically assign a review status to entity records when they are created or updated. Policies are evaluated in **priority order** (lowest number first); the first matching policy wins.

---

## Creating a policy

Go to `/admin/review/reviewpolicy/add/`.

| Field | Description |
|---|---|
| `name` | Human-readable name for this rule |
| `entity_type` | Django model label, e.g. `agents.Person`, `agents.Organisation`, `places.City` |
| `field_path` | Field to inspect. Leave empty with operator `always` to match all. Supports dot notation: `country.iso_code`, `external_ids.kind` |
| `operator` | Comparison operator |
| `value` | Value to compare against (JSON — string, number, or list) |
| `resulting_status` | Status to assign when this rule matches |
| `priority` | Evaluation order — lower = first. Use multiples of 10 for easy insertion. |
| `is_active` | Disable without deleting |
| `description` | Internal documentation |
| `review_groups` | Groups assigned to review matching records |

---

## Operators

| Operator | Example use |
|---|---|
| `always` | Apply to all records of this type unconditionally |
| `exact` | `org_type` equals `"university"` |
| `not_exact` | `imported_from` is not `"ror"` |
| `in` | `org_type` is one of `["university", "research_institute"]` |
| `not_in` | `import_last_status` is not one of `["ok", "skipped"]` |
| `contains` | `name` contains `"Hospital"` |
| `is_empty` | `orcid` is blank |
| `is_not_empty` | `ror` is set |
| `regex` | `name` matches `"^University of"` |

---

## Resulting statuses

| Status | Effect |
|---|---|
| `AUTO_APPROVED` | Approved automatically by this rule |
| `REVIEW_REQUIRED` | Route to review queue for human action |
| `DRAFT` | No action needed — record stays in draft |
| `APPROVED` | Mark as approved immediately |
| `REJECTED` | Mark as rejected immediately |
| `MANUALLY_CONFIRMED` | Mark as manually confirmed |

---

## Example policy set

### Auto-approve ROR-imported organisations

| Field | Value |
|---|---|
| Entity type | `agents.Organisation` |
| Field path | `imported_from` |
| Operator | `exact` |
| Value | `"ror"` |
| Resulting status | `AUTO_APPROVED` |
| Priority | `10` |

### Require review for manually created persons

| Field | Value |
|---|---|
| Entity type | `agents.Person` |
| Field path | `imported_from` |
| Operator | `is_empty` |
| Value | _(empty)_ |
| Resulting status | `REVIEW_REQUIRED` |
| Priority | `20` |
| Review groups | `Curators` |

### Catch-all: everything else goes to draft

| Field | Value |
|---|---|
| Entity type | `agents.Person` |
| Field path | _(empty)_ |
| Operator | `always` |
| Resulting status | `DRAFT` |
| Priority | `999` |

<div class="callout callout-tip">
  <span class="callout-title">Priority tip</span>
  Use priority values in multiples of 10 (10, 20, 30…) so you can always insert a new rule between existing ones without renumbering.
</div>

<div class="page-nav">
  <a href="/ers-docs/docs/admin/django-admin/">← Django Admin Panel</a>
  <a href="/ers-docs/docs/admin/monitoring/">Monitoring & Logs →</a>
</div>
