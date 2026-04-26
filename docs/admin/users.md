---
layout: page
title: User Management
permalink: /docs/admin/users/
---

## Creating users

### Via Django admin

1. Go to `/admin/auth/user/add/`
2. Fill in username and password → **Save and continue editing**
3. Set name, email, staff/superuser flags
4. Assign the user to appropriate **Groups**

### Via management command

```bash
docker compose exec django python manage.py createsuperuser \
  --username newadmin --email admin@example.com
```

### Auto-creation on startup

Set `DJANGO_SUPERUSER_*` in `.env`. The `ensure_superuser` management command is idempotent.

---

## User profiles

Every User has a linked `UserProfile` created via signal. The profile carries an `extra_data` JSON field for application-specific attributes. Profiles are visible (read-only) in the Django admin under **Accounts → User Profiles**.

---

## Groups and permissions

| Group name (suggested) | Permissions |
|---|---|
| `Curators` | Add, change, view all entity types |
| `Reviewers` | View all entities; change `ObjectReviewState` |
| `Importers` | Add, change Persons, Organisations, Journals |
| `Admins` | All permissions (or use Django staff/superuser) |

### Creating a review group

1. Go to `/admin/auth/group/add/`
2. Name the group (e.g. `Reviewers — Biomedical`)
3. Assign model-level permissions if needed
4. Add users to the group

---

## Staff vs. superuser

| Flag | Effect |
|---|---|
| `is_staff` | Can log into `/admin/` |
| `is_superuser` | Bypasses all permission checks |

Prefer `is_staff` + explicit group permissions over `is_superuser` for day-to-day administration.

<div class="page-nav">
  <a href="/ers-docs/docs/admin/database/">← Database</a>
  <a href="/ers-docs/docs/admin/django-admin/">Django Admin Panel →</a>
</div>
