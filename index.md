---
layout: default
title: Entity Registry System — Documentation
---

<div class="main-content">
  <div class="home-hero">
    <div class="home-hero__kicker">Open Source · Django 5 · React / Vite</div>
    <h1>Entity Registry<br>System</h1>
    <p>A shared, authoritative registry for persons, organisations, places, and journals — built for research information management and CRIS integration.</p>
    <div class="home-hero__actions">
      <a href="{{ '/quickstart/' | relative_url }}" class="btn btn--primary">Get started →</a>
      <a href="{{ '/docs/developer/api/' | relative_url }}" class="btn btn--secondary">API Reference</a>
      <a href="https://github.com/sszepe/django-ers-solution/tree/dev" class="btn btn--secondary" target="_blank" rel="noopener">View on GitHub</a>
    </div>
  </div>

  <div class="card-grid">
    <a href="{{ '/quickstart/' | relative_url }}" class="card">
      <span class="card__icon">🚀</span>
      <div class="card__title">Quickstart</div>
      <div class="card__desc">Run the full stack locally with Docker Compose in under five minutes.</div>
    </a>
    <a href="{{ '/docs/user/' | relative_url }}" class="card">
      <span class="card__icon">📋</span>
      <div class="card__title">User Guide</div>
      <div class="card__desc">Browse, search, create, and review records in the ERS Console web app.</div>
    </a>
    <a href="{{ '/docs/developer/' | relative_url }}" class="card">
      <span class="card__icon">⚙️</span>
      <div class="card__title">Developer Guide</div>
      <div class="card__desc">REST API, data model, background tasks, and frontend architecture.</div>
    </a>
    <a href="{{ '/docs/admin/' | relative_url }}" class="card">
      <span class="card__icon">🛡️</span>
      <div class="card__title">Admin Guide</div>
      <div class="card__desc">Docker deployment, configuration, user management, and monitoring.</div>
    </a>
  </div>

  <div style="max-width:840px; margin: 0 auto 64px;">
    <h2 style="font-size:22px; font-weight:700; margin-bottom:16px;">What is ERS?</h2>
    <p style="font-size:16px; color:var(--text-muted); line-height:1.7; margin-bottom:16px;">
      The Entity Registry System is a Django-based REST backend paired with a React/Vite single-page console. It maintains deduplicated, authority-controlled records for the core entities that appear across research information systems: <strong>persons</strong>, <strong>organisations</strong>, <strong>places</strong>, and <strong>journals</strong>.
    </p>
    <p style="font-size:16px; color:var(--text-muted); line-height:1.7; margin-bottom:24px;">
      Records carry persistent identifiers (ORCID, ROR, GND, Wikidata, OpenAlex …), full import provenance, a configurable review/approval workflow, and a complete audit trail — making ERS suitable as a hub data source for DSpace-CRIS, publishing platforms, or any other system that needs clean, authoritative entity data.
    </p>

    <div class="entity-grid">
      <span class="entity-pill">👤 Persons</span>
      <span class="entity-pill">🏛️ Organisations</span>
      <span class="entity-pill">🌲 Organigrams</span>
      <span class="entity-pill">🤝 Affiliations</span>
      <span class="entity-pill">📓 Journals</span>
      <span class="entity-pill">📍 Places</span>
      <span class="entity-pill">✅ Review Workflow</span>
      <span class="entity-pill">📜 Audit Log</span>
      <span class="entity-pill">🔄 Background Tasks</span>
    </div>
  </div>
</div>
