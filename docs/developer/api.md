---
layout: page
title: REST API Reference
permalink: /docs/developer/api/
---

## Base URL

```
/api/v1/
```

All endpoints return JSON. Pagination is page-number based (`?page=2`), default page size 20.

## Interactive docs (live)

| URL | Interface |
|---|---|
| `/api/schema/swagger-ui/` | Swagger UI |
| `/api/schema/redoc/` | ReDoc |
| `/api/schema/` | Raw OpenAPI 3 schema (JSON or YAML) |

---

## Authentication

Obtain a session cookie by `POST`-ing to `/accounts/login/` with `username` and `password` form fields (include the `csrftoken` cookie value as the `X-CSRFToken` header on all mutating requests).

---

## Common query parameters

All list endpoints support:

| Parameter | Effect |
|---|---|
| `search=` | Full-text search across key fields |
| `ordering=field` | Sort ascending; prefix `-` for descending |
| `page=n` | Page number |

---

## Persons

```
GET    /api/v1/persons/          list
POST   /api/v1/persons/          create
GET    /api/v1/persons/{id}/     retrieve
PATCH  /api/v1/persons/{id}/     partial update
DELETE /api/v1/persons/{id}/     delete
```

**Search fields:** `registry_id`, `given_names`, `family_names`, `orcid`, `email`, `openalex_id`, `gnd_id`
**Ordering:** `family_names`, `updated_at`, `created_at`
**Filters:** `is_active`, `imported_from`, `import_last_status`, `gender`

---

## Organisations

```
GET    /api/v1/organisations/
POST   /api/v1/organisations/
GET    /api/v1/organisations/{id}/
PATCH  /api/v1/organisations/{id}/
DELETE /api/v1/organisations/{id}/
```

**Search fields:** `registry_id`, `name`, `acronym`, `ror`, `grid`, `wikidata_id`, `openalex_id`, `gnd_id`
**Filters:** `org_type`, `is_active`, `imported_from`, `import_last_status`, `country`

---

## Organigrams

```
GET    /api/v1/organigrams/
POST   /api/v1/organigrams/
GET    /api/v1/organigrams/{id}/
PATCH  /api/v1/organigrams/{id}/
```

**Filters:** `organisation`, `organigram_type`, `is_current`

---

## Affiliations

```
GET    /api/v1/affiliations/
POST   /api/v1/affiliations/
PATCH  /api/v1/affiliations/{id}/
DELETE /api/v1/affiliations/{id}/
```

**Filters:** `person`, `organisation`, `role`, `is_primary`, `source`

---

## Journals

```
GET    /api/v1/journals/
POST   /api/v1/journals/
PATCH  /api/v1/journals/{id}/
```

**Search fields:** `title`, `issn`, `eissn`, `openalex_id`

---

## Places

```
GET  /api/v1/countries/        list countries
GET  /api/v1/countries/{id}/   retrieve
GET  /api/v1/cities/           list cities
GET  /api/v1/cities/{id}/      retrieve
```

**City search:** `name`, `ascii_name`, `country`

---

## Review

```
GET   /api/v1/review/policies/                list policies
GET   /api/v1/review/states/                  list review states
GET   /api/v1/review/states/{id}/             retrieve state
POST  /api/v1/review/states/{id}/transition/  trigger transition
GET   /api/v1/review/states/statuses/         available status choices
```

**Filter parameters on `/states/`:** `status`, `entity_type` (e.g. `agents.person`), `group`

**Transition request body:**

```json
{
  "status": "APPROVED",
  "comment": "Verified against official website."
}
```

---

## Audit

```
GET  /api/v1/audit/   list audit log entries (read-only)
```

**Filters:** `user`, `object_type`, `method`, `date_from`, `date_to`

---

## Paginated response envelope

```json
{
  "count": 142,
  "next": "http://localhost:8000/api/v1/persons/?page=2",
  "previous": null,
  "results": [ … ]
}
```

---

## Error responses

| Status | Meaning |
|---|---|
| `400` | Validation error — body contains `{"field": ["error msg"]}` |
| `401` | Not authenticated |
| `403` | Missing object permission |
| `404` | Object not found |

<div class="page-nav">
  <a href="/ers-docs/docs/developer/backend/">← Django Backend</a>
  <a href="/ers-docs/docs/developer/frontend/">ERS Console →</a>
</div>
