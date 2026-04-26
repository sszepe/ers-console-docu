---
layout: page
title: Audit Log
permalink: /docs/user/audit/
---

ERS maintains a complete audit trail of all changes made to registry entities. Every mutating API request is logged with the acting user, timestamp, HTTP method, and affected object.

---

## Viewing the audit log

Open **Audit** from the top navigation. The log is in reverse chronological order and supports filtering by entity type, user, date range, and action type.

---

## Log entry fields

| Field | Meaning |
|---|---|
| `timestamp` | When the change occurred (UTC) |
| `user` | The authenticated user who made the change |
| `method` | HTTP method (`POST`, `PATCH`, `DELETE`…) |
| `path` | API endpoint path |
| `object_type` | Django content type (e.g. `agents.person`) |
| `object_id` | Database ID of the changed record |
| `changes` | JSON diff of changed field values |

---

## Version history

For entity types tracked by **django-reversion** (Persons, Organisations, Organigrams, OrgNodes, OrgUnitFunctions), you can view the full version history in the Django admin panel. Each saved version stores a complete snapshot of the object, enabling rollback.

<div class="callout callout-info">
  <span class="callout-title">Version rollback</span>
  Version rollback is currently only available through the Django admin at <code>/admin/</code>. A Console-based rollback UI is planned for a future release.
</div>

---

## Review decision history

Review workflow transitions (approvals, rejections, comments) are stored as `ReviewTransition` records and are visible in the **Review** section rather than the general Audit log.

<div class="page-nav">
  <a href="/ers-docs/docs/user/review/">← Review Workflow</a>
  <a href="/ers-docs/docs/developer/">Developer Guide →</a>
</div>
