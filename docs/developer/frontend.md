---
layout: page
title: ERS Console (Frontend)
permalink: /docs/developer/frontend/
---

## Repository layout

```
ers-console/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
└── src/
    ├── main.tsx              entry point — mounts React root
    ├── app.tsx               Shell, auth gate, page routing
    ├── api/
    │   ├── registry.ts       typed API client per entity
    │   ├── types.ts          TypeScript interfaces for API shapes
    │   └── configOptions.ts  controlled vocabulary hooks + fallbacks
    ├── auth/
    │   └── AuthContext.tsx   AuthProvider + useAuth hook
    ├── components/
    │   ├── AppLayout.tsx     sidebar nav + top bar shell
    │   └── ui.tsx            shared UI primitives
    ├── pages/
    │   ├── persons/
    │   ├── organisations/
    │   ├── organigrams/
    │   ├── affiliations/
    │   ├── journals/
    │   ├── places/
    │   ├── imports/
    │   ├── configs/
    │   ├── audit/
    │   └── review/
    ├── routing/
    │   └── routes.ts         parseHash() hash-route parser
    ├── lib/
    │   └── apiFetch.ts       base fetch wrapper (CSRF, credentials)
    └── styles/
        ├── variables.css
        ├── app-shell.css
        └── multilevel-nav.css
```

---

## Routing

The Console uses **hash-based routing** — no React Router or server-side routing needed:

```
/cockpit/#/persons
/cockpit/#/persons/550e8400-e29b-41d4-a716-446655440000
/cockpit/#/organisations
/cockpit/#/review
```

`useHashRoute()` listens for `hashchange` events. `parseHash()` splits the hash into `{ section, uuid }`. The `renderPage()` switch in `app.tsx` maps section names to page components.

---

## State management

**TanStack Query** manages server state. Global `QueryClient` is configured with `staleTime: 30_000` and `retry: 1`. All data fetching uses `useQuery`/`useMutation` hooks calling typed functions from `src/api/registry.ts`. Local UI state uses plain `useState`.

---

## API client pattern

```typescript
// src/lib/apiFetch.ts wraps fetch to:
// - set credentials: "include" (session cookies)
// - read csrftoken cookie and set X-CSRFToken on mutating requests
// - throw on non-2xx with parsed error body

// src/api/registry.ts exports typed functions per entity:
export const personsApi = {
  list:   (params?) => apiFetch<PagedResponse<Person>>("/api/v1/persons/", { params }),
  get:    (id)      => apiFetch<Person>(`/api/v1/persons/${id}/`),
  create: (data)    => apiFetch<Person>("/api/v1/persons/", { method: "POST", body: data }),
  patch:  (id, data)=> apiFetch<Person>(`/api/v1/persons/${id}/`, { method: "PATCH", body: data }),
};
```

---

## Controlled vocabulary

`useConfigOptions(key)` fetches from `/api/v1/configs/?key=<key>` with fallback to `FALLBACK_CONFIGS`. Supported keys: `organisation_types`, `organigram_types`, `affiliation_roles`, `org_function_roles`, `genders`.

`flattenOptions()` converts the nested tree into a flat list with `depth` for indented `<select>` rendering.

---

## Shared UI primitives (`src/components/ui.tsx`)

| Component | Props / purpose |
|---|---|
| `Button` | `variant: "default" \| "primary" \| "danger" \| "ghost" \| "sm"` |
| `Badge` | `variant?: string` — maps to `badge--{variant}` CSS class |
| `ActiveBadge` | `active: boolean` — green/grey |
| `SourceBadge` | `source: string` — coloured per source (ror, orcid, openalex…) |
| `Spinner` | Loading indicator |
| `Input`, `Textarea`, `Select` | Form inputs with consistent `input` class |
| `KVRow` | Two-column key/value display row |
| `SectionBlock` | Titled content block |
| `Modal` | Overlay modal with header, body, optional footer |
| `TabBar` | Pill-style tab navigation |
| `SideListItem` | Clickable list row with title and meta |
| `Pagination` | Page prev/next strip with total count |
| `ImportCandidate` | Selectable card for import preview flow |
| `RawDataViewer` | Collapsible `<pre>` JSON dump for debugging |

---

## Error boundary

`PageErrorBoundary` wraps each page. If a component throws (typically a conditional hook violation), it shows an error message and resets on route change.

---

## Build commands

```bash
npm run build    # outputs to dist/ — served by nginx
npm run dev      # Vite dev server with HMR on :5173
npm run preview  # preview production build locally
```

**Build-time env vars** (Vite `import.meta.env`):

| Variable | Default | Notes |
|---|---|---|
| `VITE_API_BASE_URL` | `""` (relative) | Set to absolute URL for cross-origin deployments |
| `VITE_GEONAMES_USERNAME` | `"demo"` | GeoNames.org account for city imports |

<div class="page-nav">
  <a href="/ers-docs/docs/developer/api/">← REST API Reference</a>
  <a href="/ers-docs/docs/developer/data-model/">Data Model →</a>
</div>
