# Roles and Permissions

This document defines the role-based access control (RBAC) model for the Project Management System. It serves as the authoritative reference for understanding what each role can and cannot do across every functional area of the application.

---

## Table of Contents

- [Overview](#overview)
- [Role Definitions](#role-definitions)
- [Permission Matrix](#permission-matrix)
- [Authentication and Account Status](#authentication-and-account-status)
- [Role Behavior by Module](#role-behavior-by-module)
  - [Users](#users)
  - [Teams](#teams)
  - [Reports](#reports)
  - [Priorities](#priorities)
  - [Sprints](#sprints)
  - [Jira Integration](#jira-integration)
  - [Dashboard](#dashboard)
- [API-Level Enforcement](#api-level-enforcement)
- [Known Scope Boundaries](#known-scope-boundaries)

---

## Overview

The system enforces a four-tier role hierarchy. Every action a user can perform — reading a resource, creating a record, updating data, or deleting an entry — is governed by the role assigned to their account. Role enforcement is implemented at the API layer through middleware that runs on every protected route after JWT verification.

The four roles are:

| Role               | Identifier             | Scope                                             |
| ------------------ | ---------------------- | ------------------------------------------------- |
| Administrator      | `ADMIN`                | Full system access across all teams and resources |
| Product Owner      | `PRODUCT_OWNER`        | Planning and oversight authority across all teams |
| Developer          | `DEVELOPER`            | Scoped to own team and own records                |
| Authenticated User | _(any active account)_ | Baseline read access and profile management       |

Role assignment is the exclusive responsibility of an Admin. Users cannot view or modify their own role. A user's role is encoded inside their JWT token and re-evaluated on every request.

---

## Role Definitions

### Admin

The Admin role has unrestricted access to the entire system. Admins are responsible for the user lifecycle — creating accounts, assigning roles, approving or rejecting registrations, and managing team membership. Admins can read, create, update, and delete any resource in the system regardless of team scope.

Admins are also the only role that can access the Invitation Audit log, which records the history of all registration approval and rejection decisions.

### Product Owner

The Product Owner role has broad planning and oversight authority. A Product Owner can view all teams and their members but cannot modify team structure or membership — that is reserved for Admins. Product Owners have full read, create, update, and delete access to all reports and priorities across all teams. They are responsible for sprint planning: creating sprint records, assigning them to teams, and reviewing developer capacity before sprint commitment.

Product Owners cannot approve or reject user registrations, cannot manage user accounts, and cannot access the Invitation Audit log.

### Developer

The Developer role is scoped tightly to the team the developer belongs to. Developers can read their own team's reports and priorities but cannot see data from other teams. They can create reports for their own team and update their own reports, but cannot delete any report. They have no write access to priorities — priorities are managed exclusively by Admins and Product Owners.

Within sprint planning, Developers interact with the capacity workflow: they mark their own days off for a sprint, which reduces their available story points. They can view the total capacity for their team's sprint but cannot access the full planning interface.

### Authenticated User

Any account with `ACTIVE` status has a set of baseline capabilities regardless of their specific role. This includes access to the dashboard statistics, their own profile, and read-only access to Jira project and issue data. This baseline is in addition to, not a replacement for, the capabilities defined by the user's assigned role.

---

## Permission Matrix

The following table covers every significant operation in the system. A checkmark indicates the role is permitted to perform the operation. A dash indicates the operation is not permitted.

| Operation                                 | Admin | Product Owner | Developer | Authenticated |
| ----------------------------------------- | :---: | :-----------: | :-------: | :-----------: |
| **Authentication**                        |       |               |           |               |
| Register (account created as PENDING)     |   —   |       —       |     —     |    Public     |
| Login (requires ACTIVE status)            |  Yes  |      Yes      |    Yes    |      Yes      |
| Retrieve own profile (`GET /api/auth/me`) |  Yes  |      Yes      |    Yes    |      Yes      |
| Approve or reject registrations           |  Yes  |       —       |     —     |       —       |
| **Users**                                 |       |               |           |               |
| List all users                            |  Yes  |       —       |     —     |       —       |
| Create a user                             |  Yes  |       —       |     —     |       —       |
| Update user role, status, or team         |  Yes  |       —       |     —     |       —       |
| Delete a user                             |  Yes  |       —       |     —     |       —       |
| **Teams**                                 |       |               |           |               |
| List all teams                            |  Yes  |      Yes      |     —     |       —       |
| View team members                         |  Yes  |      Yes      |     —     |       —       |
| Create a team                             |  Yes  |       —       |     —     |       —       |
| Update a team                             |  Yes  |       —       |     —     |       —       |
| Delete a team                             |  Yes  |       —       |     —     |       —       |
| Add a member to a team                    |  Yes  |       —       |     —     |       —       |
| Remove a member from a team               |  Yes  |       —       |     —     |       —       |
| **Reports**                               |       |               |           |               |
| List all reports (all teams)              |  Yes  |      Yes      |     —     |       —       |
| List own team's reports                   |  Yes  |      Yes      |    Yes    |       —       |
| Create a report for own team              |  Yes  |      Yes      |    Yes    |       —       |
| Update own report                         |  Yes  |      Yes      |    Yes    |       —       |
| Update any report                         |  Yes  |      Yes      |     —     |       —       |
| Delete any report                         |  Yes  |      Yes      |     —     |       —       |
| **Priorities**                            |       |               |           |               |
| List all priorities (all teams)           |  Yes  |      Yes      |     —     |       —       |
| List own team's priorities                |  Yes  |      Yes      |    Yes    |       —       |
| Create a priority                         |  Yes  |      Yes      |     —     |       —       |
| Update a priority                         |  Yes  |      Yes      |     —     |       —       |
| Delete a priority                         |  Yes  |      Yes      |     —     |       —       |
| Link a priority to a Jira issue           |  Yes  |      Yes      |     —     |       —       |
| **Sprints**                               |       |               |           |               |
| List all sprints                          |  Yes  |      Yes      |     —     |       —       |
| Create a sprint                           |  Yes  |      Yes      |     —     |       —       |
| Update a sprint                           |  Yes  |      Yes      |     —     |       —       |
| View sprint capacity breakdown            |  Yes  |      Yes      |     —     |       —       |
| Toggle own days off in a sprint           |   —   |       —       |    Yes    |       —       |
| Access sprint planning UI                 |  Yes  |      Yes      |     —     |       —       |
| Access sprint capacity UI                 |   —   |       —       |    Yes    |       —       |
| **Jira Integration**                      |       |               |           |               |
| List Jira projects                        |  Yes  |      Yes      |    Yes    |      Yes      |
| View Jira project overview and issues     |  Yes  |      Yes      |    Yes    |      Yes      |
| View Jira project statistics              |  Yes  |      Yes      |    Yes    |      Yes      |
| Access Jira board sprints endpoint        |  Yes  |      Yes      |     —     |       —       |
| **System**                                |       |               |           |               |
| View dashboard statistics                 |  Yes  |      Yes      |    Yes    |      Yes      |
| Access Invitation Audit log               |  Yes  |       —       |     —     |       —       |

---

## Authentication and Account Status

Role permissions are only applicable to accounts with `ACTIVE` status. The account status lifecycle is as follows:

```
Registration submitted
  -> Status: PENDING
  -> Access: denied at login

Admin approves registration
  -> Status: ACTIVE
  -> Access: granted based on assigned role

Admin rejects registration
  -> Status: REJECTED
  -> Access: permanently denied
```

An account in `PENDING` or `REJECTED` status cannot log in and cannot receive a JWT token, regardless of the role assigned to it. The status check occurs at the login step before any role evaluation takes place.

---

## Role Behavior by Module

### Users

User management is exclusively an Admin responsibility. The `/api/users` endpoints are protected by an Admin-only role guard. No other role can list, create, update, or delete user accounts through the API.

The "Manage Users" page is accessible in the frontend to Product Owners as a read-oriented view, but the underlying API routes are Admin-restricted. A Product Owner navigating to that page will receive `403 Forbidden` responses for any write operations.

---

### Teams

Admins have full CRUD access to teams and manage all membership changes. Product Owners can view all teams and their members but have no write access to team structure or membership. Developers and general authenticated users do not have access to team listing or detail endpoints.

---

### Reports

Report access follows a two-axis scope model: visibility (which reports can be read) and ownership (which reports can be modified or deleted).

- **Visibility:** Admins and Product Owners can read all reports across all teams. Developers can only read reports belonging to their own team.
- **Creation:** Admins, Product Owners, and Developers can all create reports, but only for their own team.
- **Update:** A Developer can update only their own reports. A Product Owner or Admin can update any report.
- **Deletion:** Only Admins and Product Owners can delete reports. Developers cannot delete any report, including their own.

Visibility scoping is enforced at the query level in the backend. Developers do not receive a filtered list of all reports — the query itself is constrained to their team before data is returned.

---

### Priorities

Priority management is reserved for Admins and Product Owners. Developers have read-only access, limited to their own team's priorities. The visibility constraint is enforced at the query level: Developers receive only their team's priorities, while Admins and Product Owners receive all priorities across all teams.

Priorities can optionally be linked to a Jira issue. This linking capability is available only to Admins and Product Owners.

---

### Sprints

Sprint planning is a two-phase workflow with role-specific entry points.

**Planning phase (Admin / Product Owner):**

- Create sprint records with Tuesday-to-Tuesday boundaries
- Assign sprints to teams
- View the full per-developer capacity breakdown including marked absences

**Capacity phase (Developer):**

- Toggle personal days off for the sprint
- Each day off deducts 2 story points from the developer's capacity
- View the team's total story point capacity for the sprint

Developers cannot access the sprint planning interface. Admins and Product Owners cannot toggle days off on behalf of a developer — the days-off endpoint is scoped to the authenticated developer's own record.

---

### Jira Integration

Jira read access is available to all authenticated users. Any account with `ACTIVE` status can list Jira projects, view project overviews and recent issues, and see Jira statistics on the dashboard.

The board sprints endpoint, which retrieves sprint data directly from a Jira board, is restricted to Admins and Product Owners. This endpoint is used during sprint planning to cross-reference internal sprint records with Jira board state.

---

### Dashboard

The dashboard displays aggregate statistics for the authenticated user's accessible scope. All authenticated users can view the dashboard. The statistics shown — priority counts, team counts, user counts, report counts — reflect the data visible to the user's role. A Developer sees statistics scoped to their team; Admins and Product Owners see system-wide counts.

---

## API-Level Enforcement

Role enforcement is not delegated to the frontend. Every protected API route applies two middleware layers in sequence:

1. **JWT verification** — confirms the token is valid, unmodified, and not expired. Extracts the user's identity and role from the token payload. Returns `401 Unauthorized` if the token is missing or invalid.

2. **Role guard** — checks whether the authenticated user's role has permission to perform the requested operation on the requested resource. Returns `403 Forbidden` if the role is insufficient.

This means that even if the frontend were to expose a UI element to a role that should not have access, the API would reject the request independently. The frontend's role-based visibility is a UX convenience; the API's role guard is the actual security boundary.

---

## Known Scope Boundaries

The following behaviors are intentional design decisions, not bugs. They are documented here to prevent misinterpretation during testing or development.

| Behavior                                                                           | Explanation                                                                                                                                      |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Product Owner sees "Manage Users" in the UI but receives `403` on write operations | The UI exposes the page for read context. The API enforces Admin-only access on write routes.                                                    |
| Developer cannot see other teams' reports even if they know the report ID          | Visibility is enforced at the query level, not by filtering after retrieval. The record is not returned regardless of how the request is formed. |
| Developer cannot delete their own reports                                          | Deletion is a destructive operation reserved for Admins and Product Owners to maintain report integrity across the team.                         |
| Days-off toggling is self-service only for Developers                              | A planner cannot mark days off on behalf of a developer. The endpoint is bound to the authenticated user's own sprint record.                    |
| Product Owner cannot use the developer capacity workflow                           | The capacity toggle endpoint requires the `DEVELOPER` role. A Product Owner attempting this operation will receive `403 Forbidden`.              |

---

Project Management System — 2026
