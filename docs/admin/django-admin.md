---
layout: doc
title: Django Admin Panel
description: Using the built-in Django admin interface for advanced data management.
section: Admin Guide
permalink: /docs/admin/django-admin/
---

## Accessing the admin

Navigate to `/admin/` and log in with a staff or superuser account.

## Registered models

### Accounts

| Model | Notes |
|---|---|
| Users | Full Django user management with `UserProfile` inline |
| User Profiles | Read-only view; add/delete disabled |

### Agents

| Model | Admin features |
|---|---|
| **Persons** | Search by name, ORCID, GND, OpenAlex, email. Filter by gender, status, import source. Inline: Names, Affiliations, OrgUnit Functions. |
| **Organisations** | Search by name, ROR, Grid, Wikidata, OpenAlex. Filter by type, status, country. Inline: OrgNodes. Coloured type badge. Clickable ROR link. |
| **Organigrams** | Filter by type, `is_current`, organisation. Inline: OrgNodes. |
| **OrgNodes** | Filter by organigram. Autocomplete: organigram, organisation, parent. |
| **OrgUnit Functions** | Filter by function role. Coloured leadership badge. `is_current` boolean display. |
| **Person Affiliations** | Filter by role, primary flag, source, organisation. |

### Places

| Model | Notes |
|---|---|
| Countries | Seeded by `seed_countries` management command |
| Cities | Linked to countries; populated by background tasks |

### Journals

Journal list with ISSN, eISSN, publisher, OpenAlex ID.

### Review

| Model | Notes |
|---|---|
| **Review Policies** | Configure rules — entity type, field path, operator, value, resulting status, priority, groups |
| **Object Review States** | Read the current state of any reviewed object |
| **Review Transitions** | Full history of status changes |

### Django Q (background tasks)

| Section | Purpose |
|---|---|
| Tasks | Completed task history with results |
| Failed Tasks | Tasks that exhausted retries |
| Queued Tasks | Tasks waiting to run |
| Scheduled Tasks | Recurring task definitions |

## Import provenance fieldset

Every Person and Organisation admin page has a collapsible **Import provenance** fieldset (collapsed by default) containing all `import_*` fields. Expand it to inspect the raw source payload, field sources, or to add fields to `import_locked_fields`.

## Version history

For models registered with `django-reversion` (Person, Organisation, Organigram, OrgNode, OrgUnitFunction), a **History** button appears in the top-right of the change view. Click it to see every saved version and roll back if needed.

## Bulk actions

The admin list views support Django's built-in bulk delete. Custom bulk actions (e.g. bulk approve, bulk lock import fields) can be added to the relevant `ModelAdmin` via `actions = […]`.
