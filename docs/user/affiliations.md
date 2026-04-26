---
layout: doc
title: Affiliations
description: Managing Person ↔ Organisation membership records.
section: User Guide
permalink: /docs/user/affiliations/
---

## What is an Affiliation?

A **PersonAffiliation** record links a Person to an Organisation for a specific role over a date range. Affiliations are the core way ERS models employment, membership, and research group participation.

## Fields

| Field | Notes |
|---|---|
| `person` | The person (required) |
| `organisation` | The organisation (required) |
| `role` | Controlled vocabulary (see below) |
| `role_label` | Free-text description when `role` is insufficient |
| `is_primary` | Whether this is the person's primary affiliation |
| `valid_from` | Start date (inclusive) |
| `valid_to` | End date (inclusive); blank = currently active |
| `source` | How this affiliation was established (`manual`, `orcid`, `ror`, etc.) |
| `external_id` | The ID in the source system |
| `notes` | Internal notes |

## Affiliation roles

| Role value | Label |
|---|---|
| `member` | Member |
| `researcher` | Researcher |
| `professor` | Professor |
| `associate_professor` | Associate Professor |
| `assistant_professor` | Assistant Professor |
| `postdoc` | Postdoctoral researcher |
| `phd_student` | PhD student |
| `manager` | Manager |
| `director` | Director |
| `dean` | Dean |
| `rector` | Rector / President |
| `admin` | Administrative staff |
| `technical` | Technical staff |
| `emeritus` | Emeritus |
| `visiting` | Visiting researcher |
| `honorary` | Honorary |
| `other` | Other |

## Editing affiliations

Affiliations can be managed from two places:

- The **Affiliations** section in the ERS Console (full list with filtering).
- The **Affiliations inline** on a Person or Organisation detail view (context-scoped).

## Current vs. historical

An affiliation without a `valid_to` date is considered **currently active**. Historical affiliations (with `valid_to` in the past) are retained for provenance and are shown in a separate tab on the person detail view.
