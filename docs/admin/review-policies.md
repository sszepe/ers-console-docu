---
layout: doc
title: Review Policies
description: Configuring the ReviewPolicy rules that govern the review workflow.
section: Admin Guide
permalink: /docs/admin/review-policies/
---

## Overview

Review Policies are rules that automatically assign a review status to entity records when they are created or updated. Policies are evaluated in **priority order** (lowest number first); the first matching policy wins.

## Creating a policy

Go to `/admin/review/reviewpolicy/add/`.

| Field | Description |
|---|---|
| `name` | Human-readable name for this rule |
| `entity_type` | Django model label, e.g. `agents.Person`, `agents.Organisation`, `places.City` |
| `field_path` | Field to inspect. Leave empty with operator `always` to match all records. Supports dot notation: `country.iso_code`, `external_ids.kind` |
| `operator` | Comparison operator (see table below) |
| `value` | Value to compare against (JSON — can be a string, number, or list) |
| `resulting_status` | Status to assign when this rule matches |
| `priority` | Evaluation order. Lower = evaluated first. Use multiples of 10 for easy insertion. |
| `is_active` | Disable without deleting |
| `description` | Internal documentation |
| `review_groups` | Groups assigned to review matching records |

## Operators

| Operator | Example use |
|---|---|
| `always` | Apply to all records of this type |
| `exact` | `org_type` equals `"university"` |
| `not_exact` | `imported_from` is not `"ror"` |
| `in` | `org_type` is one of `["university", "research_institute"]` |
| `not_in` | `import_last_status` is not one of `["ok", "skipped"]` |
| `contains` | `name` contains `"Hospital"` |
| `is_empty` | `orcid` is blank |
| `is_not_empty` | `ror` is set |
| `regex` | `name` matches `"^University of"` |

## Resulting statuses

| Status | Effect |
|---|---|
| `DRAFT` | No action needed — record is in draft |
| `AUTO_APPROVED` | Approved automatically by this rule |
| `REVIEW_REQUIRED` | Route to review queue for human action |
| `APPROVED` | Mark as approved immediately |
| `REJECTED` | Mark as rejected immediately |
| `MANUALLY_CONFIRMED` | Mark as manually confirmed |

## Example policy set

### Auto-approve ROR-imported organisations

| Field | Value |
|---|---|
| Name | Auto-approve ROR imports |
| Entity type | `agents.Organisation` |
| Field path | `imported_from` |
| Operator | `exact` |
| Value | `"ror"` |
| Resulting status | `AUTO_APPROVED` |
| Priority | `10` |

### Require review for manually created persons

| Field | Value |
|---|---|
| Name | Review manually created persons |
| Entity type | `agents.Person` |
| Field path | `imported_from` |
| Operator | `is_empty` |
| Value | _(empty)_ |
| Resulting status | `REVIEW_REQUIRED` |
| Priority | `20` |
| Review groups | `Curators` |

### All other records go to draft

| Field | Value |
|---|---|
| Name | Default — draft |
| Entity type | `agents.Person` |
| Field path | _(empty)_ |
| Operator | `always` |
| Resulting status | `DRAFT` |
| Priority | `999` |

<div class="callout callout--tip">
  <div class="callout__title">Policy ordering tip</div>
  Use priority values in multiples of 10 (10, 20, 30 …) so you can always insert a new rule between two existing ones without renumbering.
</div>
