---
layout: page
title: Review Workflow
permalink: /docs/user/review/
---

ERS includes a configurable review workflow that governs whether entity records require human approval before being considered authoritative. The workflow is driven by **Review Policies** configured by administrators.

---

## Review statuses

| Status | Meaning |
|---|---|
| `DRAFT` | Created but not yet submitted |
| `REVIEW_REQUIRED` | Waiting for a reviewer to act |
| `AUTO_APPROVED` | Automatically approved by a matching policy |
| `APPROVED` | Manually approved by a reviewer |
| `REJECTED` | Rejected — the record needs correction |
| `MANUALLY_CONFIRMED` | Confirmed by a human after automatic approval |

---

## Status flow

```
DRAFT ──────────────────────────► REVIEW_REQUIRED
  │                                      │
  │ (policy: AUTO_APPROVED)              │ (reviewer acts)
  ▼                                      ▼
AUTO_APPROVED                    APPROVED / REJECTED
  │
  │ (human confirmation)
  ▼
MANUALLY_CONFIRMED
```

---

## Reviewing records

<ol class="steps">
  <li><div><strong>Open Review</strong> from the top navigation.</div></li>
  <li><div><strong>Filter</strong> by entity type, status, or assigned review group.</div></li>
  <li><div><strong>Click a record</strong> to open its detail view.</div></li>
  <li><div><strong>Review</strong> the record data and any attached comments.</div></li>
  <li><div><strong>Approve, Reject, or Request changes</strong> — optionally add a comment.</div></li>
</ol>

---

## Review groups

An `ObjectReviewState` can be assigned to one or more **Django Groups**. Only members of those groups (or staff users) can act on the review. This allows routing records to specialised teams.

---

## Decision history

Every status transition is recorded as a `ReviewTransition` entry, capturing the actor, old/new status, comment, and timestamp. This history is visible in the Review detail view.

---

## For administrators

Review Policies are configured in the Django admin. See [Review Policies](/ers-docs/docs/admin/review-policies/) for the full configuration reference.

<div class="page-nav">
  <a href="/ers-docs/docs/user/imports/">← Imports</a>
  <a href="/ers-docs/docs/user/audit/">Audit Log →</a>
</div>
