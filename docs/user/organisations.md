---
layout: page
title: Organisations
permalink: /docs/user/organisations/
---

An **Organisation** record represents any institution, department, company, or other organisational entity. Organisations are the backbone of the registry: Persons are affiliated to them, Organigrams are owned by them, and Places are associated with them.

---

## Organisation types

| Type | Typical use |
|---|---|
| `university` | Top-level HEI |
| `faculty` | Faculty or school within a university |
| `department` | Academic department |
| `institute` | Research institute or centre |
| `chair` | Chair / professorship |
| `research_institute` | Standalone research institute |
| `company` | Private company |
| `government` | Government body or agency |
| `hospital` | Hospital or clinical centre |
| `nonprofit` | Non-profit organisation |
| `funder` | Funding body |
| `infrastructure` | Research infrastructure or facility |
| `unit` | Generic organisational unit |
| `working_group` | Working group or team |
| `unknown` | Default when type is not yet determined |

Types `faculty`, `institute`, `department`, `chair`, `unit`, and `working_group` are **sub-unit types** — they typically appear as nodes inside an Organigram rather than standalone top-level organisations.

---

## Identifiers

| Identifier | Authority |
|---|---|
| **ROR** | Research Organization Registry — `https://ror.org/…` (unique, enforced) |
| Alternative RORs | Previous or variant ROR IDs |
| **GRID** | Global Research Identifier Database (legacy) |
| **ISNI** | International Standard Name Identifier |
| **GND ID** | Gemeinsame Normdatei |
| **Wikidata ID** | `Q` number |
| **OpenAlex ID** | `I` number |
| **FundRef ID** | Crossref Funder Registry |
| **External IDs** | Free-form JSON for any other identifiers |

<div class="callout callout-info">
  <span class="callout-title">ROR uniqueness</span>
  The <code>ror</code> field is enforced unique across the database. Attempting to create a duplicate ROR returns a validation error.
</div>

---

## Organisation relationships

The **OrganisationRelationships** model records how organisations relate to each other over time:

| Relationship type | Meaning |
|---|---|
| `merge` | Two or more orgs merged into one |
| `absorption_merge` | One org absorbed by another |
| `split` | One org split into multiple |
| `spin_off` | A new org was spun off |
| `split_off` | A division was separated |
| `carve_out` | Assets carved out into a new entity |
| `joint_venture_creation` | A joint venture was formed |
| `associate` | Informal association |
| `rename` | The organisation was renamed |

---

## Import from ROR

The most common import path is from the Research Organization Registry. The background `qcluster` worker pulls ROR records and creates or updates Organisation entries, resolving Places and setting `imported_from = "ror"`. On subsequent runs, unchanged records are skipped via SHA-256 payload hash comparison.

<div class="page-nav">
  <a href="/ers-docs/docs/user/persons/">← Persons</a>
  <a href="/ers-docs/docs/user/organigrams/">Organigrams →</a>
</div>
