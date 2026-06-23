# Operation Flow Patterns

## Purpose

Standard operation flows in PC admin / workflow apps. Use these as building
blocks when designing the primary loop and supporting pages.

## List-and-Act Flow

```text
List view
  -> Search / filter
    -> Select row
      -> View detail
        -> Edit / Submit / Approve / Reject / Delete
          -> Return to list with toast confirmation
```

Use for: tasks, requests, reports, tickets, orders.

## Fill-and-Submit Flow

```text
Form page (possibly from template)
  -> Auto-save draft
    -> Validate
      -> Submit
        -> Pending review state
```

Use for: report submission, request creation, data entry.

## Review-and-Decide Flow

```text
Pending review list
  -> Open detail
    -> Approve / Reject with comment
      -> State change
        -> Notify submitter
```

Use for: approval, audit, triage, risk review.

## Assign-and-Track Flow

```text
Incoming item
  -> Triage / classify
    -> Assign to handler
      -> Handler updates progress
        -> Close / Escalate
```

Use for: repair requests, support tickets, inspection tasks.

## Dashboard Summary Flow

```text
Aggregate data
  -> Stat cards
    -> Charts
      -> Recent items list
        -> Drill-down to list page
```

Use for: homepage, management overview, KPI screen.

## Settings-and-Master-Data Flow

```text
Settings menu
  -> Users / Roles / Departments / Dictionaries / Menus
    -> CRUD operations
      -> Permission / scope rules applied
```

Use for: system administration, configuration.

## Notification Flow

```text
Event occurs (submit, approve, reject, assign)
  -> In-app announcement or badge
    -> Optional external notification (out of V1 by default)
```

Use for: alerts, deadlines, status changes.

## Choosing a Flow

| If the primary loop is... | Use... |
|---------------------------|--------|
| User creates data and waits for a result | Fill-and-Submit + List-and-Act |
| User reviews data created by others | Review-and-Decide + List-and-Act |
| Items arrive and must be routed | Assign-and-Track + List-and-Act |
| Manager needs overview first | Dashboard Summary + drill-down |
| Admin configures the system | Settings-and-Master-Data |
