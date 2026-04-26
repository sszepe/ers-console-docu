---
layout: doc
title: User Guide
description: How to use the ERS Console to manage persons, organisations, places, journals, and more.
section: User Guide
permalink: /docs/user/
---

The ERS Console is a browser-based management interface for the Entity Registry System. It gives authorised users a clean way to browse, search, create, edit, and review all registry entities without touching the Django admin panel.

## Accessing the Console

Navigate to `http://<your-server>/cockpit/` and log in with your ERS account. If you have just run the Quickstart setup, use the superuser credentials you set in `.env`.

<div class="callout callout--info">
  <div class="callout__title">Session-based authentication</div>
  The Console uses Django session cookies. Your session persists across page reloads. Use the <strong>Logout</strong> button in the top bar to end it explicitly.
</div>

## Navigation

The left sidebar lists all available sections. The current section is highlighted. Clicking a section loads its list view in the main pane; clicking a record opens its detail panel.

| Section | What you manage |
|---|---|
| Persons | Individual researchers and other people |
| Organisations | Institutions, departments, companies |
| Organigrams | Hierarchical org charts per institution |
| Affiliations | Person ↔ Organisation membership records |
| Journals | Academic and scientific journals |
| Places | Countries and cities (reference data) |
| Imports | Import records from external sources (ROR, ORCID, OpenAlex, GND…) |
| Configs | Controlled vocabulary configuration |
| Audit | Change log for all registry objects |
| Review | Review queue and approval workflow |

## Common actions

Most entity pages follow a consistent pattern:

- **Search** — type in the search box to filter the list by name, identifier, or other key fields.
- **Create** — click the **+ New** button to open a blank creation form.
- **Edit** — click a record to open its detail view, then click **Edit**.
- **Save** — confirm changes with the **Save** button. Changes are versioned (django-reversion).
- **Review** — if the record requires review, a status badge is shown. See the [Review Workflow](/docs/user/review/) section.

## Sections

- [Persons](/docs/user/persons/)
- [Organisations](/docs/user/organisations/)
- [Organigrams](/docs/user/organigrams/)
- [Affiliations](/docs/user/affiliations/)
- [Journals](/docs/user/journals/)
- [Places](/docs/user/places/)
- [Imports](/docs/user/imports/)
- [Review Workflow](/docs/user/review/)
- [Audit Log](/docs/user/audit/)
