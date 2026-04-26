---
layout: page
title: Affiliations
permalink: /docs/user/affiliations/
---

A **PersonAffiliation** links a Person to an Organisation for a specific role over a date range. Affiliations are the core way ERS models employment, membership, and research group participation.

---

## Fields

| Field | Notes |
|---|---|
| `person` | The person (required) |
| `organisation` | The organisation (required) |
| `role` | Controlled vocabulary (see below) |
| `role_label` | Free-text description when `role` is insufficient |
| `is_primary` | Whether this is the person's primary affiliation |
| `valid_from` | Start date (inclusive) |
| `valid_to` | End date (inclusive); blank = currently active |
| `source` | How this was established: `manual`, `orcid`, `ror`… |
| `external_id` | The ID in the source system |
| `notes` | Internal notes |

---

## Affiliation roles

`member` · `researcher` · `professor` · `associate_professor` · `assistant_professor` · `postdoc` · `phd_student` · `manager` · `director` · `dean` · `rector` · `admin` · `technical` · `emeritus` · `visiting` · `honorary` · `other`

---

## Editing affiliations

Affiliations can be managed from:
- The **Affiliations** section in the ERS Console (full list with filtering)
- The **Affiliations inline** on a Person or Organisation detail view

An affiliation without a `valid_to` date is considered **currently active**. Historical affiliations are retained for provenance.

<div class="page-nav">
  <a href="/ers-docs/docs/user/organigrams/">← Organigrams</a>
  <a href="/ers-docs/docs/user/journals/">Journals →</a>
</div>
