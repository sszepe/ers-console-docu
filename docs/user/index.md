---
layout: page
title: User Guide
permalink: /docs/user/
---

The **ERS Console** is a browser-based management interface for the Entity Registry System. It gives authorised users a clean way to browse, search, create, edit, and review all registry entities.

---

## Accessing the Console

Navigate to `http://<your-server>/cockpit/` and log in with your ERS account.

<div class="callout callout-info">
  <span class="callout-title">Session authentication</span>
  The Console uses Django session cookies. Your session persists across page reloads. Use the <strong>Logout</strong> button to end it explicitly.
</div>

---

## Navigation

The top navigation bar provides dropdown menus for each section. Clicking a section loads its list view; clicking a record opens its detail panel.

| Section | What you manage |
|---|---|
| **Persons** | Individual researchers and other named people |
| **Organisations** | Institutions, departments, companies, funders |
| **Organigrams** | Hierarchical org charts per institution |
| **Affiliations** | Person ↔ Organisation membership records |
| **Journals** | Academic and scientific journals |
| **Places** | Countries and cities (reference data) |
| **Imports** | Import records from external sources (ROR, ORCID, OpenAlex, GND…) |
| **Configs** | Controlled vocabulary configuration |
| **Audit** | Change log for all registry objects |
| **Review** | Review queue and approval workflow |

---

## Common actions

Most entity pages follow a consistent pattern:

- **Search** — type in the search box to filter the list by name, identifier, or other key fields.
- **Create** — click **+ New** to open a blank creation form.
- **Edit** — click a record to open its detail view, then click **Edit**.
- **Save** — confirm changes with **Save**. Changes are versioned (django-reversion).
- **Review** — if the record requires review, a status badge is shown.

---

## Sections

- [Persons](/ers-docs/docs/user/persons/)
- [Organisations](/ers-docs/docs/user/organisations/)
- [Organigrams](/ers-docs/docs/user/organigrams/)
- [Affiliations](/ers-docs/docs/user/affiliations/)
- [Journals](/ers-docs/docs/user/journals/)
- [Places](/ers-docs/docs/user/places/)
- [Imports](/ers-docs/docs/user/imports/)
- [Review Workflow](/ers-docs/docs/user/review/)
- [Audit Log](/ers-docs/docs/user/audit/)
