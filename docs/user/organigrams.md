---
layout: page
title: Organigrams
permalink: /docs/user/organigrams/
---

An **Organigram** is a named, versioned hierarchical chart describing the internal structure of an Organisation. A single top-level organisation can have multiple simultaneous organigrams of different types.

---

## Organigram types

| Type | Use |
|---|---|
| `administrative` | Official administrative hierarchy |
| `research` | Research group / academic unit structure |
| `governance` | Board, council, senate structure |
| `operational` | Operational or project-based structure |
| `custom` | Any other purpose |

---

## Nodes (OrgNode)

Each organigram is built from **OrgNode** records. Every node:

- References an **Organisation** record (typically a sub-unit type)
- Optionally references a **parent node** (adjacency list — depth is cached automatically; root = 0)
- Carries a `role_label` for the position in this specific chart context
- Has a `position` integer for display ordering among siblings

The same Organisation can appear as a node in multiple organigrams.

---

## OrgUnit Functions

A **OrgUnitFunction** records a person's formal function within an organigram node — e.g. Head of Department, Dean, Senate Member.

| Field | Notes |
|---|---|
| `function_role` | Controlled vocabulary (see below) |
| `function_label` | Free-text description of the specific function |
| `valid_from` / `valid_to` | Date range for this appointment |

### Function roles

`head` · `deputy_first` · `deputy_second` · `deputy_third` · `deputy_other` · `board_member` · `committee_member` · `senate_member` · `coordinator` · `secretary` · `treasurer` · `member` · `observer` · `other`

Leadership roles (`head`, `deputy_*`) are highlighted in the Django admin with a red badge.

---

## Validity

An organigram has `valid_from` / `valid_to` dates and an `is_current` flag. Only one organigram of a given type per organisation should be `is_current` at any time.

<div class="page-nav">
  <a href="/ers-docs/docs/user/organisations/">← Organisations</a>
  <a href="/ers-docs/docs/user/affiliations/">Affiliations →</a>
</div>
