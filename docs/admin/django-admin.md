---
layout: page
title: Django Admin Panel
permalink: /docs/admin/django-admin/
---

## Access

Navigate to `/admin/` and log in with a staff or superuser account.

---

## Registered sections

### Accounts

| Model | Notes |
|---|---|
| **Users** | Full Django user management with `UserProfile` inline |
| **User Profiles** | Read-only view; add/delete disabled |

### Agents

| Model | Admin features |
|---|---|
| **Persons** | Search: name, ORCID, GND, OpenAlex, email. Filter: gender, status, import source. Inlines: Names, Affiliations, OrgUnit Functions. |
| **Organisations** | Search: name, ROR, Grid, Wikidata, OpenAlex. Filter: type, status, country. Coloured type badge, clickable ROR link. |
| **Organigrams** | Filter: type, `is_current`, organisation. Inline: OrgNodes. |
| **OrgNodes** | Filter: organigram. Autocomplete: organigram, organisation, parent. |
| **OrgUnit Functions** | Coloured leadership badge. `is_current` boolean column. |
| **Person Affiliations** | Filter: role, primary flag, source, organisation. |

### Places

| Model | Notes |
|---|---|
| Countries | Seeded by `seed_countries` management command |
| Cities | Populated by background GeoNames tasks |

### Review

| Model | Notes |
|---|---|
| **Review Policies** | Configure entity type, field path, operator, value, resulting status, priority, groups |
| **Object Review States** | Current state of any reviewed object |
| **Review Transitions** | Full history of status changes |

### Django Q

| Section | Purpose |
|---|---|
| Tasks | Completed task history with results |
| Failed Tasks | Tasks that exhausted retries |
| Queued Tasks | Tasks waiting to run |
| Scheduled Tasks | Recurring task definitions |

---

## Import provenance fieldset

Every Person and Organisation change page has a collapsible **Import provenance** fieldset (collapsed by default). Expand it to inspect raw source payload, field sources, or to add field names to `import_locked_fields`.

---

## Version history

For models registered with `django-reversion` (Person, Organisation, Organigram, OrgNode, OrgUnitFunction), a **History** button appears in the top-right of the change view. Click it to see every saved version and roll back if needed.

<div class="page-nav">
  <a href="/ers-docs/docs/admin/users/">← User Management</a>
  <a href="/ers-docs/docs/admin/review-policies/">Review Policies →</a>
</div>
