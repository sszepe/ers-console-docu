---
layout: doc
title: Organigrams
description: Managing hierarchical organisational charts in ERS.
section: User Guide
permalink: /docs/user/organigrams/
---

## What is an Organigram?

An **Organigram** is a named, versioned hierarchical chart that describes the internal structure of an Organisation. A single top-level organisation can have multiple simultaneous organigrams of different types (administrative structure, research groups, governance council, etc.).

## Organigram types

| Type | Use |
|---|---|
| `administrative` | The official administrative hierarchy |
| `research` | Research group / academic unit structure |
| `governance` | Board, council, senate structure |
| `operational` | Operational or project-based structure |
| `custom` | Any other purpose |

## Nodes

Each organigram is built from **OrgNode** records. Every node:

- References an **Organisation** record (which may be a sub-unit type like `department` or `faculty`).
- Optionally references a **parent node** (adjacency list — the depth is cached automatically).
- Carries a `role_label` for the position in this specific chart context.
- Has a `position` integer for display ordering among siblings.

The same Organisation record can appear as a node in multiple organigrams.

## OrgUnit Functions

A **OrgUnitFunction** records a person's formal function within an organigram node — for example, the Head of a department, or a Senate member. Functions carry:

- `function_role` — controlled vocabulary: `head`, `deputy_first`, `deputy_second`, `deputy_third`, `deputy_other`, `board_member`, `committee_member`, `senate_member`, `coordinator`, `secretary`, `treasurer`, `member`, `observer`, `other`
- `function_label` — free-text description of the specific function
- `valid_from` / `valid_to` — date range for this appointment

Leadership roles (`head`, `deputy_*`) are highlighted in the admin with a red badge.

## Validity

An organigram has `valid_from` / `valid_to` dates and an `is_current` flag. Only one organigram of a given type per organisation should be marked `is_current` at any time.
