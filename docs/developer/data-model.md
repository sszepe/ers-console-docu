---
layout: page
title: Data Model
permalink: /docs/developer/data-model/
---

## Entity Relationship Overview

```
Country ◄──── City
  ▲              ▲
  │              │
Person ──────────┘
  ├── PersonName (0..*)
  ├── PersonAffiliation (0..*) ──► Organisation
  └── OrgUnitFunction (0..*) ───► OrgNode

Organisation ──► Country / City
Organisation ── OrganisationRelationships ──► Organisation
Organisation ──► Organigram (1..*)
              └── OrgNode (tree, 0..*)

Journal (standalone)

ReviewPolicy ──► ObjectReviewState ──► any model (GenericFK)
                  └── ReviewTransition (0..*)

AuditLog ──► any model (GenericFK)
```

---

## Person

| Field | Type | Notes |
|---|---|---|
| `registry_id` | `CharField(128)` | Unique internal ID |
| `given_names` | `CharField(512)` | |
| `family_names` | `CharField(512)` | |
| `name_sort` | `CharField` | Computed sort key |
| `gender` | `CharField(1)` | `m` / `f` / `o` / blank |
| `is_active` | `BooleanField` | Soft delete flag |
| `orcid` | `CharField` | URL format |
| `alternative_orcids` | `JSONField` | List of previous ORCID iDs |
| `isni` / `researcher_id` / `scopus_author_id` | `CharField` | PIDs |
| `gnd_id` / `wikidata_id` / `openalex_id` | `CharField` | Authority PIDs |
| `email` | `EmailField` | |
| `homepage` | `URLField` | |
| `country` | `FK → Country` | |
| `city` | `FK → City` | |
| `external_ids` | `JSONField` | Catch-all PID dict |
| `imported_from` | `CharField` | Source system name |
| `imported_at` | `DateTimeField` | |
| `import_remote_id` | `CharField` | ID in source system |
| `import_last_status` | `CharField` | `ok` / `partial` / `error` / `skipped` |
| `import_locked_fields` | `JSONField` | Field names immune to re-import |
| `import_payload_hash` | `CharField` | SHA-256 of last payload |
| `import_raw_data` | `JSONField` | Raw source payload |
| `notes` | `TextField` | Internal |
| `created_at` / `updated_at` | auto | |

---

## Organisation

Carries the same import provenance fields as Person, plus:

| Field | Type | Notes |
|---|---|---|
| `name_variants` | `JSONField` | Alternative names list |
| `acronym` | `CharField(64)` | |
| `org_type` | `CharField(64)` | Controlled vocabulary |
| `ror` | `URLField` | Unique, null allowed |
| `alternative_rors` | `JSONField` | |
| `grid` / `isni` / `gnd_id` / `wikidata_id` / `openalex_id` / `fundref_id` | `CharField` | PIDs |
| `url` / `address` | | Contact info |
| `is_subunit` | `@property` | True if `org_type` in SUBUNIT_TYPES |

**SUBUNIT_TYPES:** `unit`, `faculty`, `institute`, `chair`, `working_group`

---

## Organigram

| Field | Type | Notes |
|---|---|---|
| `uuid` | `UUIDField` | Public stable ID |
| `organisation` | `FK → Organisation` | Owner |
| `name` | `CharField(256)` | |
| `slug` | `SlugField(128)` | Unique per organisation |
| `organigram_type` | `CharField` | administrative / research / governance / operational / custom |
| `is_current` | `BooleanField` | |
| `valid_from` / `valid_to` | `DateField` | |

---

## OrgNode

| Field | Type | Notes |
|---|---|---|
| `uuid` | `UUIDField` | |
| `organigram` | `FK → Organigram` | |
| `organisation` | `FK → Organisation` | The unit at this node |
| `parent` | `FK → OrgNode (self)` | null = root |
| `role_label` | `CharField` | Context label for this position |
| `position` | `PositiveIntegerField` | Sibling sort order |
| `depth` | `PositiveSmallIntegerField` | Auto-computed; root = 0 |

---

## PersonName

| Field | Type | Notes |
|---|---|---|
| `person` | `FK → Person` | |
| `name_type` | `CharField` | Primary, Alternative, Preferred display… |
| `given_names` / `family_names` / `display_name` | `CharField` | |
| `language` | `CharField(8)` | ISO 639-1 |
| `valid_from` / `valid_to` | `DateField` | |

---

## PersonAffiliation

| Field | Type | Notes |
|---|---|---|
| `person` | `FK → Person` | |
| `organisation` | `FK → Organisation` | |
| `role` | `CharField` | Controlled vocabulary |
| `role_label` | `CharField` | Free-text |
| `is_primary` | `BooleanField` | |
| `valid_from` / `valid_to` | `DateField` | |
| `source` | `CharField` | `manual` / `orcid` / `ror`… |
| `external_id` | `CharField` | ID in source system |

---

## ReviewPolicy

| Field | Type | Notes |
|---|---|---|
| `entity_type` | `CharField` | Django model label, e.g. `agents.Person` |
| `field_path` | `CharField` | Field or JSON path to inspect |
| `operator` | `CharField` | `always` / `exact` / `not_exact` / `in` / `not_in` / `contains` / `is_empty` / `is_not_empty` / `regex` |
| `value` | `JSONField` | Comparison value |
| `resulting_status` | `CharField` | Status to assign when rule matches |
| `priority` | `PositiveIntegerField` | Lower = evaluated first |
| `review_groups` | `M2M → Group` | Groups assigned to review |

---

## ObjectReviewState

| Field | Type | Notes |
|---|---|---|
| `content_type` | `FK → ContentType` | Generic FK target type |
| `object_id` | `CharField` | Generic FK PK |
| `object_uuid` | `UUIDField` | Optional stable UUID of the object |
| `status` | `CharField` | Current review status |
| `policy` | `FK → ReviewPolicy` | Policy that set this state |
| `reason` | `TextField` | Notes |
| `assigned_groups` | `M2M → Group` | |
| `decided_by` | `FK → User` | |
| `decided_at` | `DateTimeField` | |
| unique_together | `(content_type, object_id)` | One state per object |

<div class="page-nav">
  <a href="/ers-docs/docs/developer/frontend/">← ERS Console</a>
  <a href="/ers-docs/docs/developer/background-tasks/">Background Tasks →</a>
</div>
