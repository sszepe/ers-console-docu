---
layout: page
title: Imports
permalink: /docs/user/imports/
---

The **Imports** section lets you trigger and monitor data imports from external authority systems.

---

## Supported sources

| Source | Entity types | Identifier |
|---|---|---|
| **ROR** | Organisations | ROR ID (`https://ror.org/…`) |
| **ORCID** | Persons | ORCID iD |
| **OpenAlex** | Persons, Organisations, Journals | OpenAlex ID |
| **GND** | Persons, Organisations | GND ID |
| **Wikidata** | Persons, Organisations | Wikidata Q ID |
| **GeoNames** | Places (Cities) | GeoNames ID |

---

## Import workflow

<ol class="steps">
  <li><div><strong>Navigate to Imports</strong> in the ERS Console.</div></li>
  <li><div><strong>Select the source</strong> system from the dropdown.</div></li>
  <li><div><strong>Enter identifiers</strong> — one or more IDs, or upload a CSV list.</div></li>
  <li><div><strong>Preview</strong> candidate matches against existing registry records.</div></li>
  <li><div><strong>Review candidates</strong> — confirm which records to import or update.</div></li>
  <li><div><strong>Import</strong> — the task is enqueued and processed by <code>qcluster</code> in the background.</div></li>
  <li><div><strong>Monitor progress</strong> in the import task list.</div></li>
</ol>

---

## Import statuses

| Status | Meaning |
|---|---|
| `ok` | Import completed successfully |
| `partial` | Some fields could not be mapped |
| `error` | Import failed — check task logs |
| `skipped` | No change detected (payload hash matched) |

---

## Field locking & deduplication

- **Field locking** — add a field name to `import_locked_fields` on an imported record to prevent the next run from overwriting it.
- **Payload hash** — every import stores a SHA-256 hash of the raw source payload in `import_payload_hash`. Records with unchanged payloads are automatically skipped.

---

## Background processing

All import tasks run in the `qcluster` django-q2 worker. Monitor queued and completed tasks in the Django admin under **Django Q → Tasks**.

<div class="page-nav">
  <a href="/ers-docs/docs/user/places/">← Places</a>
  <a href="/ers-docs/docs/user/review/">Review Workflow →</a>
</div>
