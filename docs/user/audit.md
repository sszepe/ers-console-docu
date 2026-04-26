---
layout: doc
title: Audit Log
description: Viewing the change history for all registry records.
section: User Guide
permalink: /docs/user/audit/
---

## Overview

ERS maintains a complete audit trail of all changes made to registry entities. Every API request that creates, updates, or deletes a record is logged with the acting user, timestamp, HTTP method, and the affected object.

## Viewing the audit log

Open the **Audit** section in the ERS Console. The log is presented in reverse chronological order and supports filtering by:

- **Entity type** — limit to changes on Persons, Organisations, etc.
- **User** — show changes by a specific user
- **Date range** — show changes within a time window
- **Action** — create, update, or delete

## Log entry fields

| Field | Meaning |
|---|---|
| `timestamp` | When the change occurred (UTC) |
| `user` | The authenticated user who made the change |
| `method` | HTTP method (`POST`, `PATCH`, `DELETE`, …) |
| `path` | API endpoint path |
| `object_id` | Database ID of the changed record |
| `object_type` | Django content type (e.g. `agents.person`) |
| `changes` | JSON diff of changed field values |

## Version history

For entity types tracked by **django-reversion** (Persons, Organisations, Organigrams, OrgNodes, OrgUnitFunctions), you can view the full version history through the Django admin panel. Each saved version stores a complete snapshot of the object, allowing rollback if needed.

<div class="callout callout--info">
  <div class="callout__title">Version rollback</div>
  Version rollback is currently only available through the Django admin panel at <code>/admin/</code>. A Console-based rollback UI is planned for a future release.
</div>

## Review decision history

All review workflow transitions (approvals, rejections, comments) are also stored as `ReviewTransition` records and are visible in the **Review** section rather than the general Audit log.
