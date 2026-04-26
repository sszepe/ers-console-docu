---
layout: doc
title: Places
description: Countries and cities — reference geographic data in ERS.
section: User Guide
permalink: /docs/user/places/
---

## Overview

The **Places** module provides reference geographic data used by Persons and Organisations. It contains two entity types: **Country** and **City**.

## Countries

Countries are seeded on first boot via the `seed_countries` management command. Each country record carries:

- ISO 3166-1 alpha-2 code (`BE`, `DE`, `FR`, …)
- Full English name
- GeoNames ID (for cross-referencing with city data)

Countries are referenced by Person (location) and Organisation (headquarters country) records.

## Cities

Cities are linked to a Country and carry:

- GeoNames ID
- Name and ASCII name
- Population
- Latitude / longitude

City data is populated via background tasks that call the GeoNames API (requires a GeoNames username — set `VITE_GEONAMES_USERNAME` in `.env`).

## Editing places

Places are primarily managed by import tasks rather than manual editing. Direct edits are possible through the Django admin panel (`/admin/`). The ERS Console **Places** page provides a read-only browseable view.

<div class="callout callout--info">
  <div class="callout__title">Read-only in Console</div>
  The Places section in the ERS Console is intentionally read-only. All changes to country and city data should go through the Django admin or the import pipeline to maintain data integrity.
</div>
