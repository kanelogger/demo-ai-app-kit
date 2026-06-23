# Page Component Patterns

## Purpose

Reusable page layouts and component blocks for PC admin apps. All patterns use
Tailwind CSS utilities and extend the neutral shell templates.

## Login Page

- Centered card on a light background.
- Username + password inputs with icons.
- Demo account hint (for local skeleton only).
- Extends `base.html` directly (no sidebar).

## Dashboard Page

- Page title + subtitle.
- 3-4 stat cards with icon, value, and trend placeholder.
- Optional chart area.
- Optional recent-items list.
- Extends `layout.html`.

## List Page

- Page header with title and primary action button.
- Search/filter bar.
- Data table with sortable columns.
- Pagination or "load more".
- Row actions: view, edit, delete.
- Extends `layout.html`.

## Form Page

- Page header with title.
- Form sections grouped by card.
- Required field markers.
- Action bar: save draft, submit, cancel.
- Client-side validation helpers.
- Extends `layout.html`.

## Detail / Review Page

- Page header with entity identifier and status badge.
- Read-only summary section.
- Action section: approve / reject / comment.
- Audit trail (who, when, action).
- Extends `layout.html`.

## Settings Page

- Page header.
- Tabbed or card-grouped configuration sections.
- Master-data tables with inline or modal edit.
- Extends `layout.html`.

## Reusable Components

### Stat Card

```html
<div class="card">
  <div class="flex items-start justify-between">
    <div>
      <p class="text-sm font-medium text-gray-500">Label</p>
      <h3 class="text-3xl font-bold text-primary mt-1">Value</h3>
    </div>
    <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
      <i class="fas fa-icon text-xl"></i>
    </div>
  </div>
</div>
```

### Data Table

```html
<table class="min-w-full divide-y divide-gray-200">
  <thead>
    <tr>
      <th class="table-th">Column</th>
    </tr>
  </thead>
  <tbody class="bg-white divide-y divide-gray-100">
    <tr class="hover:bg-gray-50 transition-colors duration-150">
      <td class="table-td">Value</td>
    </tr>
  </tbody>
</table>
```

### Form Card

```html
<div class="card">
  <h2 class="text-lg font-semibold text-gray-800 mb-4">Section Title</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label class="form-label" for="field">Field Label</label>
      <input class="form-input" id="field" name="field" type="text">
    </div>
  </div>
</div>
```

### Modal

```html
<div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
  <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4">
    <div class="p-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold">Modal Title</h3>
    </div>
    <div class="p-4">Content</div>
    <div class="p-4 border-t border-gray-200 flex justify-end space-x-2">
      <button class="btn-outline">Cancel</button>
      <button class="btn-primary">Confirm</button>
    </div>
  </div>
</div>
```
