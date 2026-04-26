---
layout: doc
title: Review Workflow
description: Understanding and using the configurable review and approval workflow.
section: User Guide
permalink: /docs/user/review/
---

## Overview

ERS includes a configurable review workflow that governs whether entity records require human approval before being considered authoritative. The workflow applies to all entity types (Persons, Organisations, Journals, …) and is driven by **Review Policies** configured by administrators.

## Review statuses

Every entity record tracked by the review system carries an `ObjectReviewState` with one of these statuses:

| Status | Meaning |
|---|---|
| `DRAFT` | Created but not yet submitted for review |
| `REVIEW_REQUIRED` | Waiting for a reviewer to act |
| `AUTO_APPROVED` | Automatically approved by a matching policy |
| `APPROVED` | Manually approved by a reviewer |
| `REJECTED` | Rejected — the record needs correction |
| `MANUALLY_CONFIRMED` | Confirmed by a human after automatic approval |

## Status transitions

```
DRAFT ──────────────────────────► REVIEW_REQUIRED
   │                                     │
   │ (policy: always AUTO_APPROVED)      │ (reviewer acts)
   ▼                                     ▼
AUTO_APPROVED                      APPROVED / REJECTED
   │
   │ (human confirmation)
   ▼
MANUALLY_CONFIRMED
```

## Reviewing records

<ol class="step-list">
  <li>Open the <strong>Review</strong> section in the ERS Console.</li>
  <li>Use the filters to narrow by entity type, status, or assigned review group.</li>
  <li>Click a record to open its detail view.</li>
  <li>Review the record data and any attached comments.</li>
  <li>Click <strong>Approve</strong>, <strong>Reject</strong>, or <strong>Request changes</strong>.</li>
  <li>Optionally add a comment explaining your decision.</li>
</ol>

## Review groups

An `ObjectReviewState` can be assigned to one or more **Django Groups**. Only members of those groups (or staff users) can act on the review. This allows you to route biological-sciences records to one team and clinical records to another.

## Audit of decisions

Every status transition is recorded as a `ReviewTransition` entry, capturing the actor, the old and new status, a comment, and a timestamp. This history is visible in the Review detail view.

## For administrators

Review Policies are configured in the Django admin. See [Review Policies](/docs/admin/review-policies/) for the full configuration reference.
