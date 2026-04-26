---
layout: page
title: Admin Guide
permalink: /docs/admin/
---

## Quick reference — admin URLs

| URL | Purpose |
|---|---|
| `/admin/` | Django admin panel |
| `/admin/auth/user/` | User management |
| `/admin/auth/group/` | Group management |
| `/admin/review/reviewpolicy/` | Review policy configuration |
| `/admin/django_q/` | Background task monitoring |
| `/api/schema/swagger-ui/` | Live API documentation |
| `/health/` | Health probe endpoint |

---

## First-time setup checklist

<ol class="steps">
  <li><div>Copy <code>.env.example</code> to <code>.env</code> and set <code>DJANGO_SECRET_KEY</code> and <code>POSTGRES_PASSWORD</code>.</div></li>
  <li><div>Set <code>ALLOWED_HOSTS</code> and <code>CSRF_TRUSTED_ORIGINS</code> for your domain.</div></li>
  <li><div>Optionally set <code>DJANGO_SUPERUSER_*</code> for auto-creation of the first admin account.</div></li>
  <li><div>Run <code>docker compose up -d</code>.</div></li>
  <li><div>Verify all services are healthy: <code>docker compose ps</code>.</div></li>
  <li><div>Log in to <code>/admin/</code> and create any additional user accounts.</div></li>
  <li><div>Configure <a href="/ers-docs/docs/admin/review-policies/">Review Policies</a> as needed.</div></li>
</ol>

---

## Sections

- [Docker Deployment](/ers-docs/docs/admin/deployment/)
- [Configuration Reference](/ers-docs/docs/admin/configuration/)
- [Database & Migrations](/ers-docs/docs/admin/database/)
- [User Management](/ers-docs/docs/admin/users/)
- [Django Admin Panel](/ers-docs/docs/admin/django-admin/)
- [Review Policies](/ers-docs/docs/admin/review-policies/)
- [Monitoring & Logs](/ers-docs/docs/admin/monitoring/)
