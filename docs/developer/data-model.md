---
layout: doc
title: Data Model
description: Entity-relationship overview for all ERS database models.
section: Developer Guide
permalink: /docs/developer/data-model/
---

## Entity Relationship Overview

```
Country ◄──── City
  ▲              ▲
  │              │
Person ──────────┘
  │
  ├── PersonName (0..*)
  ├── PersonAffiliation (0..*) ──► Organisation
  └── OrgUnitFunction (0..*) ───► OrgNode

Organisation ──► Country
Organisation ──► City
Organisation ── OrganisationRelationships ──► Organisation
Organisation ──► Organigram (1..*)
              └── OrgNode (tree, 0..*)
                    └── OrgNode (children)

Journal (standalone)

ReviewPolicy (rule set)
ObjectReviewState ──► any model (GenericFK) ──► ReviewPolicy
ReviewTransition (0..*) ──► ObjectReviewState

AuditLog ──► any model (GenericFK)
```

## Model reference

### Person

| Field | Type | Notes |
|---|---|---|
| `registry_id` | `CharField(128)` | Unique internal ID |
| `given_names` | `CharField(512)` | |
| `family_names` | `CharField(512)` | |
| `name_sort` | `CharField` | Computed sort key |
| `gender` | `CharField(1)` | `m`/`f`/`o`/blank |
| `is_active` | `BooleanField` | Soft delete |
| `orcid` | `CharField` | URL format |
| `alternative_orcids` | `JSONField` | List of strings |
| `isni` | `CharField` | |
| `researcher_id` | `CharField` | |
| `scopus_author_id` | `CharField` | |
| `gnd_id` | `CharField` | |
| `wikidata_id` | `CharField` | |
| `openalex_id` | `CharField` | |
| `email` | `EmailField` | |
| `homepage` | `URLField` | |
| `country` | `FK → Country` | |
| `city` | `FK → City` | |
| `external_ids` | `JSONField` | Catch-all PID dict |
| `imported_from` | `CharField` | Source system name |
| `imported_at` | `DateTimeField` | |
| `import_remote_id` | `CharField` | ID in source system |
| `import_last_status` | `CharField` | `ok`/`partial`/`error`/`skipped` |
| `import_locked_fields` | `JSONField` | Field names immune to re-import |
| `import_field_sources` | `JSONField` | Per-field source tracking |
| `import_payload_hash` | `CharField` | SHA-256 of last payload |
| `import_raw_data` | `JSONField` | Raw source payload |
| `notes` | `TextField` | Internal |
| `created_at` / `updated_at` | `DateTimeField` | Auto |

### Organisation

Carries the same import provenance fields as Person, plus:

| Field | Type | Notes |
|---|---|---|
| `name_variants` | `JSONField` | Alternative names list |
| `acronym` | `CharField(64)` | |
| `org_type` | `CharField(64)` | See Organisation Types |
| `ror` | `URLField` | Unique, null allowed |
| `alternative_rors` | `JSONField` | |
| `grid` | `CharField(64)` | |
| `fundref_id` | `CharField(64)` | |
| `url` | `URLField` | |
| `address` | `TextField` | |

### PersonName

| Field | Type | Notes |
|---|---|---|
| `person` | `FK → Person` | |
| `name_type` | `CharField` | Primary, Alternative, Preferred display, etc. |
| `given_names` | `CharField` | |
| `family_names` | `CharField` | |
| `display_name` | `CharField` | Full display form |
| `language` | `CharField(8)` | ISO 639-1 |
| `valid_from` / `valid_to` | `DateField` | |

### PersonAffiliation

| Field | Type | Notes |
|---|---|---|
| `person` | `FK → Person` | |
| `organisation` | `FK → Organisation` | |
| `role` | `CharField` | Controlled vocabulary |
| `role_label` | `CharField` | Free-text description |
| `is_primary` | `BooleanField` | |
| `valid_from` / `valid_to` | `DateField` | |
| `source` | `CharField` | `manual`/`orcid`/`ror`/… |
| `external_id` | `CharField` | ID in source system |

### Organigram

| Field | Type | Notes |
|---|---|---|
| `uuid` | `UUIDField` | Public stable ID |
| `organisation` | `FK → Organisation` | Owner |
| `name` | `CharField(256)` | |
| `slug` | `SlugField(128)` | Unique per organisation |
| `organigram_type` | `CharField` | administrative/research/governance/operational/custom |
| `is_current` | `BooleanField` | |
| `valid_from` / `valid_to` | `DateField` | |

### OrgNode

| Field | Type | Notes |
|---|---|---|
| `uuid` | `UUIDField` | |
| `organigram` | `FK → Organigram` | |
| `organisation` | `FK → Organisation` | The unit at this node |
| `parent` | `FK → OrgNode (self)` | `null` = root |
| `role_label` | `CharField` | Context label |
| `position` | `PositiveIntegerField` | Sibling sort order |
| `depth` | `PositiveSmallIntegerField` | Auto-computed; root = 0 |

### OrgUnitFunction

| Field | Type | Notes |
|---|---|---|
| `person` | `FK → Person` | |
| `org_node` | `FK → OrgNode` | |
| `function_role` | `CharField` | Controlled vocabulary |
| `function_label` | `CharField` | Free-text |
| `valid_from` / `valid_to` | `DateField` | |
| `source` | `CharField` | |

### ReviewPolicy

| Field | Type | Notes |
|---|---|---|
| `uuid` | `UUIDField` | |
| `entity_type` | `CharField` | Django label, e.g. `agents.Person` |
| `field_path` | `CharField` | Field or JSON path to inspect |
| `operator` | `CharField` | `always`/`exact`/`not_exact`/`in`/`not_in`/`contains`/`is_empty`/`is_not_empty`/`regex` |
| `value` | `JSONField` | Comparison value |
| `resulting_status` | `CharField` | Status to assign when rule matches |
| `priority` | `PositiveIntegerField` | Lower = evaluated first |
| `is_active` | `BooleanField` | |
| `review_groups` | `M2M → Group` | Groups notified/assigned |

### ObjectReviewState

| Field | Type | Notes |
|---|---|---|
| `uuid` | `UUIDField` | |
| `content_type` | `FK → ContentType` | Generic FK target type |
| `object_id` | `CharField` | Generic FK PK |
| `object_uuid` | `UUIDField` | Optional stable UUID of the object |
| `status` | `CharField` | Current review status |
| `policy` | `FK → ReviewPolicy` | Policy that set this state |
| `reason` | `TextField` | Notes |
| `assigned_groups` | `M2M → Group` | |
| `decided_by` | `FK → User` | |
| `decided_at` | `DateTimeField` | |
| `transitions` | reverse relation to `ReviewTransition` | |
