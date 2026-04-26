---
layout: page
title: Places
permalink: /docs/user/places/
---

The **Places** module provides reference geographic data used by Persons and Organisations. It contains two entity types: **Country** and **City**.

---

## Countries

Countries are seeded on first boot via the `seed_countries` management command. Each record carries ISO 3166-1 alpha-2 code, full English name, and GeoNames ID.

Countries are referenced by:
- **Person** — country of affiliation
- **Organisation** — headquarters country

---

## Cities

Cities are linked to a Country and carry GeoNames ID, name, ASCII name, population, and latitude/longitude. City data is populated via background tasks calling the GeoNames API.

Set `VITE_GEONAMES_USERNAME` in `.env` to your GeoNames.org account username (the `demo` account is rate-limited).

---

## Editing places

<div class="callout callout-info">
  <span class="callout-title">Read-only in Console</span>
  The Places section in the ERS Console is intentionally read-only. All changes to country and city data should go through the Django admin (<code>/admin/</code>) or the import pipeline.
</div>

<div class="page-nav">
  <a href="/ers-docs/docs/user/journals/">← Journals</a>
  <a href="/ers-docs/docs/user/imports/">Imports →</a>
</div>
