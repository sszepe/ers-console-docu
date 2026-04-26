---
layout: doc
title: Imports
description: Importing entity data from external authority sources.
section: User Guide
permalink: /docs/user/imports/
---

## Overview

The **Imports** section lets you trigger and monitor data imports from external authority systems. ERS supports importing from:

| Source | Entity types | Identifier |
|---|---|---|
| **ROR** | Organisations | ROR ID (`https://ror.org/…`) |
| **ORCID** | Persons | ORCID iD |
| **OpenAlex** | Persons, Organisations, Journals | OpenAlex ID |
| **GND** | Persons, Organisations | GND ID |
| **Wikidata** | Persons, Organisations | Wikidata Q ID |
| **GeoNames** | Places (Cities) | GeoNames ID |

## Import workflow

<ol class="step-list">
  <li>Navigate to the <strong>Imports</strong> page in the ERS Console.</li>
  <li>Select the source system from the dropdown.</li>
  <li>Enter one or more identifiers, or upload a CSV list.</li>
  <li>Click <strong>Preview</strong> to see candidate matches against existing registry records.</li>
  <li>Review the candidates — confirm which records to import or update.</li>
  <li>Click <strong>Import</strong> to enqueue the task. The <code>qcluster</code> worker will process it in the background.</li>
  <li>Monitor progress in the import task list.</li>
</ol>

## Import statuses

Each imported record tracks a `import_last_status`:

| Status | Meaning |
|---|---|
| `ok` | Import completed successfully |
| `partial` | Some fields could not be mapped |
| `error` | Import failed — check task logs |
| `skipped` | No change detected (payload hash matched) |

## Field locking

If you have manually corrected a field on an imported record, add the field name to `import_locked_fields` to prevent the next import run from overwriting it.

## Payload hash deduplication

Every import stores a SHA-256 hash of the raw source payload in `import_payload_hash`. On subsequent runs, if the hash is unchanged the record is skipped, making repeated imports cheap.

## Background processing

All import tasks are handled by the `qcluster` django-q2 worker. You can monitor queued and completed tasks in the Django admin under **Django Q → Tasks**.
