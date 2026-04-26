---
layout: doc
title: Persons
description: Managing individual researcher and person records in ERS.
section: User Guide
permalink: /docs/user/persons/
---

## What is a Person record?

A **Person** record represents a named individual — typically a researcher — in the registry. Each person has a unique `registry_id` and can carry multiple persistent identifiers linking it to external authority systems.

## Searching persons

Open the **Persons** section from the sidebar. The list shows display name, key identifiers, import source, status, and last-updated date.

- Use the **search box** to filter by name, ORCID, GND ID, OpenAlex ID, email, or registry ID.
- Use the **status filter** to show only active or inactive records.
- Use the **import source filter** to show records imported from a specific external system.

## Creating a person

Click **+ New Person** and fill in the form:

### Core identity

| Field | Notes |
|---|---|
| `given_names` | First / middle names |
| `family_names` | Surname(s) |
| `gender` | `m` / `f` / `o` (other/undisclosed) or blank |
| `is_active` | Uncheck to soft-delete without removing the record |

### Identifiers

ERS stores a rich set of persistent identifiers. Fill in whichever are known:

| Identifier | Authority |
|---|---|
| ORCID | `https://orcid.org/0000-0000-0000-0000` format |
| Alternative ORCIDs | JSON list of previous ORCID iDs |
| ISNI | International Standard Name Identifier |
| ResearcherID (Web of Science) | `A-0000-0000` format |
| Scopus Author ID | Numeric |
| GND ID | Gemeinsame Normdatei |
| Wikidata ID | `Q` number |
| OpenAlex ID | `A` number |
| External IDs | Free-form JSON for any other identifiers |

### Contact & location

| Field | Notes |
|---|---|
| `email` | Primary contact email |
| `homepage` | Personal or institutional page URL |
| `country` | Country of affiliation (linked to Places) |
| `city` | City (linked to Places) |

### Alternate names

Use the **Names** inline to add variant name forms (e.g. a maiden name, transliteration, or display name in another language). Each name record carries:
- `name_type` — Primary, Alternative, Preferred display, etc.
- `given_names` / `family_names` / `display_name`
- `language` — ISO 639-1 code
- `valid_from` / `valid_to` — date range this name was in use

## Affiliations

The **Affiliations** inline on the person detail view lists all Person ↔ Organisation relationships. See [Affiliations](/docs/user/affiliations/) for details.

## Organigram functions

The **Organigram functions** inline shows any formal positions this person holds within an organisational hierarchy (e.g. Head of Department, Dean). These are managed via the [Organigrams](/docs/user/organigrams/) section.

## Import provenance

When a person was imported from an external source (ROR, ORCID, OpenAlex, GND), the **Import provenance** section shows:

| Field | Meaning |
|---|---|
| `imported_from` | Source system name |
| `imported_at` | When the import ran |
| `import_remote_id` | The ID in the source system |
| `import_last_status` | `ok`, `partial`, `error`, or `skipped` |
| `import_locked_fields` | Fields that will not be overwritten on re-import |
| `import_payload_hash` | SHA-256 of the last imported payload (used to detect changes) |

<div class="callout callout--warning">
  <div class="callout__title">Field locking</div>
  If you manually correct a field on an imported record, add it to <code>import_locked_fields</code> to prevent the next automatic import from overwriting your change.
</div>

## Review status

Newly created or modified persons may be placed in a review queue depending on the active [Review Policies](/docs/admin/review-policies/). The status badge in the list view shows:

| Badge | Meaning |
|---|---|
| `DRAFT` | Not yet submitted for review |
| `REVIEW_REQUIRED` | Waiting for a reviewer |
| `AUTO_APPROVED` | Automatically approved by policy |
| `APPROVED` | Manually approved |
| `REJECTED` | Rejected — needs correction |
| `MANUALLY_CONFIRMED` | Confirmed by a human after auto-approval |
