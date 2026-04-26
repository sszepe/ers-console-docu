---
layout: page
title: Journals
permalink: /docs/user/journals/
---

The **Journals** section maintains an authority list of academic and scientific journals, primarily used as controlled vocabulary for publication metadata in downstream CRIS and repository systems.

---

## Key fields

| Field | Notes |
|---|---|
| `registry_id` | Unique internal identifier |
| `title` | Primary journal title |
| `issn` | Print ISSN |
| `eissn` | Electronic ISSN |
| `openalex_id` | OpenAlex source ID (`S` number) |
| `wikidata_id` | Wikidata `Q` number |
| `publisher` | Publisher name |
| `is_active` | Whether the journal is currently publishing |

---

## Importing journals

Journals can be imported from **OpenAlex** using the background task system. The import resolves ISSNs and matches existing records before creating new ones, using SHA-256 payload hash deduplication to skip unchanged entries.

<div class="page-nav">
  <a href="/ers-docs/docs/user/affiliations/">← Affiliations</a>
  <a href="/ers-docs/docs/user/places/">Places →</a>
</div>
