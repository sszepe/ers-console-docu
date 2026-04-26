---
layout: doc
title: User Management
description: Creating users, assigning groups, and managing permissions in ERS.
section: Admin Guide
permalink: /docs/admin/users/
---

## Creating users

### Via Django admin

1. Go to `/admin/auth/user/add/`
2. Fill in username and password
3. Click **Save and continue editing**
4. Set name, email, and staff/superuser flags as needed
5. Assign the user to appropriate **Groups**

### Via management command (scripted)

```bash
docker compose exec django python manage.py createsuperuser \
  --username newadmin --email admin@example.com
```

### Auto-creation on startup

Set the `DJANGO_SUPERUSER_*` variables in `.env` to create the initial superuser automatically. The `ensure_superuser` management command is idempotent — it does nothing if the user already exists.

## User profiles

Every User has a linked `UserProfile` (created via signal on user creation). The profile carries an `extra_data` JSON field for application-specific attributes. Profiles are visible (read-only) in the Django admin under **Accounts → User Profiles**.

## Groups and permissions

ERS uses Django's built-in group system for:

- **Review assignment** — `ObjectReviewState.assigned_groups` controls which groups can review a record.
- **Object-level permissions** — django-guardian assigns `view`/`change`/`delete` permissions per object per user or group.

### Creating a review group

1. Go to `/admin/auth/group/add/`
2. Name the group (e.g. `Reviewers — Biomedical`, `Curators — Organisations`)
3. Assign model-level permissions if needed
4. Click **Save**
5. Add users to the group via the user's Group list or the group's User list

### Common group setups

| Group name | Suggested permissions |
|---|---|
| `Curators` | Add, change, view on all entity types |
| `Reviewers` | View on all entities; `change` on `ObjectReviewState` |
| `Importers` | Add, change on Persons, Organisations, Journals |
| `Admins` | All permissions (or use Django staff/superuser) |

## Staff vs. superuser

| Flag | Effect |
|---|---|
| `is_staff` | Can log into `/admin/` |
| `is_superuser` | Bypasses all permission checks |

For day-to-day administration, prefer `is_staff` + explicit group permissions over `is_superuser`.

## Password policies

Django's built-in validators are enabled:
- `UserAttributeSimilarityValidator` — password must not be too similar to username/email
- `MinimumLengthValidator` — minimum 8 characters
- `CommonPasswordValidator` — rejects common passwords
- `NumericPasswordValidator` — rejects all-numeric passwords

To enforce stronger policies, add `django-password-validation` or configure via `AUTH_PASSWORD_VALIDATORS` in `settings/base.py`.
