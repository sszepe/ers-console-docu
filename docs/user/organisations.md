---
layout: doc
title: Organisations
description: Managing institution, department, and company records in ERS.
section: User Guide
permalink: /docs/user/organisations/
---

## Overview

An **Organisation** record represents any institution, department, company, or other organisational entity. Organisations are the backbone of the registry: Persons are affiliated to them, Organigrams are owned by them, and Places are associated with them.

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

Types marked as **sub-unit types** (`faculty`, `institute`, `department`, `chair`, `unit`, `working_group`) are expected to appear as nodes inside an Organigram rather than as standalone top-level organisations.

## Identifiers

Organisations carry a rich set of persistent identifiers:

| Identifier | Authority |
|---|---|
| **ROR** | Research Organization Registry (preferred — URL format `https://ror.org/…`) |
| Alternative RORs | Previous or variant ROR IDs |
| **GRID** | Global Research Identifier Database (legacy) |
| **ISNI** | International Standard Name Identifier |
| **GND ID** | Gemeinsame Normdatei |
| **Wikidata ID** | `Q` number |
| **OpenAlex ID** | `I` number |
| **FundRef ID** | Crossref Funder Registry |
| External IDs | Free-form JSON for any other identifiers |

<div class="callout callout--info">
  <div class="callout__title">ROR uniqueness</div>
  The <code>ror</code> field is enforced unique across the database. If you attempt to create a duplicate ROR, the form will return a validation error.
</div>

## Location

Organisations are linked to **Country** and **City** records from the Places module. When an organisation is imported from ROR, its location is resolved automatically via a background task that matches GeoNames data to ERS Place records.

## Relationships between organisations

The **Organisation Relationships** model records how organisations relate to each other over time:

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

## Import from ROR

The most common import path is from the Research Organization Registry. The background `qcluster` worker can pull ROR records and create or update Organisation entries, resolving Places and setting `imported_from = "ror"`.

On subsequent runs, the import compares the SHA-256 hash of the incoming payload against `import_payload_hash` and skips unchanged records.
