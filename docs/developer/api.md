---
layout: doc
title: REST API Reference
description: All REST API endpoints, query parameters, and response shapes.
section: Developer Guide
permalink: /docs/developer/api/
---

## Base URL

```
/api/v1/
```

All endpoints return JSON. Pagination is page-number based (`?page=2`), with a default page size of 20.

## Interactive docs

The live OpenAPI schema is served at runtime:

- **Swagger UI**: `/api/schema/swagger-ui/`
- **ReDoc**: `/api/schema/redoc/`
- **Raw schema**: `/api/schema/` (JSON or YAML with `Accept:` header)

## Authentication

All write operations (`POST`, `PATCH`, `PUT`, `DELETE`) require an authenticated session. Obtain a session cookie by `POST`-ing to `/accounts/login/` with `username` and `password` form fields (include the CSRF token from a prior `GET /accounts/login/`).

## Common query parameters

All list endpoints support:

| Parameter | Effect |
|---|---|
| `search=` | Full-text search across key fields (see per-endpoint details) |
| `ordering=field` | Sort by field (prefix `-` for descending, e.g. `-updated_at`) |
| `page=n` | Page number |

## Endpoint reference

### Persons — `GET /api/v1/persons/`

<span class="badge badge--get">GET</span> `/api/v1/persons/` — list  
<span class="badge badge--post">POST</span> `/api/v1/persons/` — create  
<span class="badge badge--get">GET</span> `/api/v1/persons/{id}/` — retrieve  
<span class="badge badge--patch">PATCH</span> `/api/v1/persons/{id}/` — partial update  
<span class="badge badge--delete">DELETE</span> `/api/v1/persons/{id}/` — delete  

**Search fields:** `registry_id`, `given_names`, `family_names`, `orcid`, `email`, `openalex_id`, `gnd_id`  
**Ordering fields:** `family_names`, `updated_at`, `created_at`  
**Filters:** `is_active`, `imported_from`, `import_last_status`, `gender`

---

### Organisations — `GET /api/v1/organisations/`

<span class="badge badge--get">GET</span> `/api/v1/organisations/` — list  
<span class="badge badge--post">POST</span> `/api/v1/organisations/` — create  
<span class="badge badge--get">GET</span> `/api/v1/organisations/{id}/` — retrieve  
<span class="badge badge--patch">PATCH</span> `/api/v1/organisations/{id}/` — partial update  
<span class="badge badge--delete">DELETE</span> `/api/v1/organisations/{id}/` — delete  

**Search fields:** `registry_id`, `name`, `acronym`, `ror`, `grid`, `wikidata_id`, `openalex_id`, `gnd_id`  
**Filters:** `org_type`, `is_active`, `imported_from`, `import_last_status`, `country`

---

### Organigrams — `GET /api/v1/organigrams/`

<span class="badge badge--get">GET</span> `/api/v1/organigrams/` — list  
<span class="badge badge--post">POST</span> `/api/v1/organigrams/` — create  
<span class="badge badge--get">GET</span> `/api/v1/organigrams/{id}/` — retrieve  
<span class="badge badge--patch">PATCH</span> `/api/v1/organigrams/{id}/` — partial update  

**Filters:** `organisation`, `organigram_type`, `is_current`

---

### Affiliations — `GET /api/v1/affiliations/`

<span class="badge badge--get">GET</span> `/api/v1/affiliations/` — list  
<span class="badge badge--post">POST</span> `/api/v1/affiliations/` — create  
<span class="badge badge--patch">PATCH</span> `/api/v1/affiliations/{id}/` — partial update  
<span class="badge badge--delete">DELETE</span> `/api/v1/affiliations/{id}/` — delete  

**Filters:** `person`, `organisation`, `role`, `is_primary`, `source`

---

### Journals — `GET /api/v1/journals/`

<span class="badge badge--get">GET</span> `/api/v1/journals/` — list  
<span class="badge badge--post">POST</span> `/api/v1/journals/` — create  
<span class="badge badge--patch">PATCH</span> `/api/v1/journals/{id}/` — partial update  

**Search fields:** `title`, `issn`, `eissn`, `openalex_id`

---

### Places — `GET /api/v1/countries/`, `/api/v1/cities/`

<span class="badge badge--get">GET</span> `/api/v1/countries/` — list countries  
<span class="badge badge--get">GET</span> `/api/v1/countries/{id}/` — retrieve  
<span class="badge badge--get">GET</span> `/api/v1/cities/` — list cities  
<span class="badge badge--get">GET</span> `/api/v1/cities/{id}/` — retrieve  

**City search fields:** `name`, `ascii_name`, `country`

---

### Review — `GET /api/v1/review/states/`

<span class="badge badge--get">GET</span> `/api/v1/review/policies/` — list review policies  
<span class="badge badge--get">GET</span> `/api/v1/review/states/` — list review states  
<span class="badge badge--get">GET</span> `/api/v1/review/states/{id}/` — retrieve state  
<span class="badge badge--post">POST</span> `/api/v1/review/states/{id}/transition/` — trigger transition  
<span class="badge badge--get">GET</span> `/api/v1/review/states/statuses/` — available status choices  

**Transition request body:**
```json
{
  "status": "APPROVED",
  "comment": "Verified against official website."
}
```

**Filter parameters on `/api/v1/review/states/`:**  
`status`, `entity_type` (e.g. `agents.person`), `group`

---

### Audit — `GET /api/v1/audit/`

<span class="badge badge--get">GET</span> `/api/v1/audit/` — list audit log entries (read-only)

**Filter parameters:** `user`, `object_type`, `method`, `date_from`, `date_to`

## Response envelope (paginated list)

```json
{
  "count": 142,
  "next": "http://localhost:8000/api/v1/persons/?page=2",
  "previous": null,
  "results": [ … ]
}
```

## Error responses

| Status | Meaning |
|---|---|
| `400 Bad Request` | Validation error — body contains `{"field": ["error msg"]}` |
| `401 Unauthorized` | Not authenticated |
| `403 Forbidden` | Authenticated but missing object permission |
| `404 Not Found` | Object does not exist |
| `429 Too Many Requests` | Rate limit exceeded |
