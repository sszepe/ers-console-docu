---
layout: doc
title: ERS Console (Frontend)
description: Architecture, routing, state management, and component patterns of the ERS Console React app.
section: Developer Guide
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
    ├── main.tsx          # Entry point — mounts React root
    ├── app.tsx           # Shell, auth gate, page routing
    ├── api/
    │   ├── registry.ts   # API client functions per entity type
    │   ├── types.ts      # TypeScript interfaces for all API shapes
    │   └── configOptions.ts  # Controlled vocabulary hooks + fallbacks
    ├── auth/
    │   └── AuthContext.tsx   # AuthProvider + useAuth hook
    ├── components/
    │   ├── AppLayout.tsx     # Sidebar nav + top bar shell
    │   ├── ui.tsx            # Shared UI primitives (Button, Modal, Badge…)
    │   └── …
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
    │   └── routes.ts         # parseHash() hash-route parser
    ├── lib/
    │   └── apiFetch.ts       # Base fetch wrapper (CSRF, credentials)
    └── styles/
        ├── variables.css     # CSS custom properties
        ├── app-shell.css     # Layout + nav styles
        └── multilevel-nav.css
```

## Routing

The Console uses **hash-based routing** — no React Router, no server-side routing required. `window.location.hash` drives the active page:

```
/cockpit/#/persons
/cockpit/#/persons/550e8400-e29b-41d4-a716-446655440000
/cockpit/#/organisations
/cockpit/#/review
```

The `useHashRoute()` hook listens for `hashchange` events and returns the current hash. `parseHash()` splits the hash into `{ section, uuid }`. The `renderPage()` switch in `app.tsx` maps section names to page components.

## State management

Server state is managed by **TanStack Query** (`@tanstack/react-query`). The global `QueryClient` is configured with:
- `staleTime: 30_000` — data is considered fresh for 30 seconds
- `retry: 1` — one automatic retry on failure

All data fetching is done in page-level components via `useQuery`/`useMutation` hooks calling the functions in `src/api/registry.ts`.

Local UI state (selected row, open modal, form values) uses plain `useState`.

## API client

`src/lib/apiFetch.ts` wraps `fetch` to:
- Set `credentials: "include"` (send session cookies)
- Read the CSRF token from the `csrftoken` cookie and set `X-CSRFToken` on mutating requests
- Throw on non-2xx responses with the parsed error body

`src/api/registry.ts` exports typed functions for each entity:

```typescript
// Example
export const personsApi = {
  list: (params?: PersonListParams) => apiFetch<PagedResponse<Person>>("/api/v1/persons/", { params }),
  get:  (id: number) => apiFetch<Person>(`/api/v1/persons/${id}/`),
  create: (data: PersonCreate) => apiFetch<Person>("/api/v1/persons/", { method: "POST", body: data }),
  patch:  (id: number, data: Partial<PersonCreate>) =>
            apiFetch<Person>(`/api/v1/persons/${id}/`, { method: "PATCH", body: data }),
};
```

## Controlled vocabulary — `configOptions`

The `useConfigOptions(key)` hook fetches type configuration from `/api/v1/configs/?key=<key>` and falls back to the `FALLBACK_CONFIGS` constant if the API is unavailable. Supported keys: `organisation_types`, `organigram_types`, `affiliation_roles`, `org_function_roles`, `genders`.

`flattenOptions()` converts the nested tree into a flat list with `depth` for indented `<select>` rendering.

## Shared UI primitives (`src/components/ui.tsx`)

| Component | Props |
|---|---|
| `Button` | `variant?: "default" \| "primary" \| "danger" \| "ghost" \| "sm"` |
| `Badge` | `variant?: string` — maps to `badge--{variant}` CSS class |
| `ActiveBadge` | `active: boolean` — green/grey badge |
| `SourceBadge` | `source: string` — coloured badge per source system |
| `Spinner` | Loading indicator |
| `Input`, `Textarea`, `Select` | Form inputs with consistent `input` class |
| `KVRow` | Two-column key/value display row |
| `SectionBlock` | Titled content block |
| `Modal` | Portal-free overlay modal with header, body, and optional footer |
| `TabBar` | Pill-style tab navigation |
| `SideListItem` | Clickable list row with title and meta |
| `Pagination` | Page prev/next strip with total count |
| `ImportCandidate` | Selectable card for import preview flow |
| `RawDataViewer` | Collapsible `<pre>` JSON dump for debugging |

## Error boundary

`PageErrorBoundary` wraps each page render. If a page component throws during render (typically a conditional hook violation), it shows an error message and resets on route change.

## Build

```bash
npm run build   # outputs to dist/
npm run dev     # Vite dev server with HMR
npm run preview # preview the production build locally
```

The `VITE_API_BASE_URL` and `VITE_GEONAMES_USERNAME` env vars are injected at build time via Vite's `import.meta.env`.
