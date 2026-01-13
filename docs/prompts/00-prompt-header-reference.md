# Prompt Header Reference

This document defines the standard metadata header for all prompt files in this vault using **Obsidian Properties**.

Properties are rendered as a clean, visual interface at the top of your note in Obsidian, making it easy to view and edit metadata at a glance.

---

## Standard Properties Template

All prompt files should start with this YAML frontmatter (Obsidian Properties):

```yaml
---
title: Brief descriptive title
id: XX-slug-name
created: 2025-12-13
updated: 2025-12-13
status: draft
executed_date: 
execution_result: pending
deprecated: false
deprecated_reason: 
target: backend
complexity: moderate
tags:
  - feature-name
  - component-name
dependencies:
  - XX-prompt-id
blocks:
  - XX-prompt-id
related_specs:
  - "[[specifications/spec-name]]"
related_planning:
  - "[[planning/brainstorm-name]]"
notes: 
---
```

> **Note**: Obsidian will render this as a beautiful property panel with dropdowns, date pickers, and tag editors!

---

## Field Definitions
Text
- **Obsidian Type**: Text property
- **Description**: Brief, descriptive title of what the prompt accomplishes
- **Example**: `Setup Authentication Service`

#### `id`
- **Type**: Text
- **Obsidian Type**: Text property
- **Description**: Unique identifier matching the filename (without .md extension)
- **Format**: `NN-slug-name` where NN is sequential number
- **Example**: `04-setup-auth-service`

#### `created`
- **Type**: Date
- **Obsidian Type**: Date property
- **Description**: Date when the prompt was first created
- **Example**: `2025-12-13`
- **Note**: Obsidian renders a date picker for easy selection

#### `status`
- **Type**: Text (use as dropdown)
- **Obsidian Type**: Text property (configure as dropdown in Obsidian)*: Date when the prompt was first created
- **Example**: `2025-12-13`

#### `status`
- **Type**: Enum
- **Options**:
  - `draft` - Work in progress, not ready to execute
  - `ready` - Fully specified, ready to be executed
  - `executed` - Has been executed/implemented
  - `deprecated` - No longer relevant or superseded
- **Description*
- **Obsidian Type**: Date property
- **Description**: Date when the prompt was executed (leave empty if not executed)
- **Default**: Empty
- **Example**: `2025-12-13`

#### `execution_result`
- **Type**: Text
- **Obsidian Type**: Text property (configure as dropdown)the prompt was executed
- **Default**: `null`
- **Example**: `2025-12-13`

#### `execution_result`
- **Type**: Enum or `pending`
- **Options**:
  - `pending` - Not yet executed (default)
  - `success` - Fully successful implementation
  - `partialCheckbox
- **Obsidian Type**: Checkbox property
- **Description**: Whether this prompt is deprecated
- **Default**: `false` (unchecked)

#### `deprecated_reason`
- **Type**: Text
- **Obsidian Type**: Text property
- **Description**: Explanation of why prompt was deprecated (leave empty if not deprecated)
- **Default**: Empty
- **Example**: `Superseded by new architecture approach`


- **Example**: `"Superseded by new architecture approach"`
List or Text
- **Obsidian Type**: List property (for multiple) or Text property (for single)
- **Options**: `backend`, `frontend`, `chrome-ext`, `mobile`, `infrastructure`, `docs`, `all`
- **Description**: Which part of the system this prompt targets
- **Example**: `backend` or list with multiple values

#### `complexity`
- **Type**: Text
- **Obsidian Type**: Text property (configure as dropdown)
- **Options**: `simple`, `moderate`, `complex`
- **Description**: Estimated complexity of implementation
- **Example**: `moderate`

#### `tags`
- **Type**: List
- **Obsidian Type**: Tags property (renders as clickable tags)
- **Description**: Searchable tags for categorization
- **Example**:
  ```yaml
  tags:
    - authentication
    - security
    - user-management
  ```
- **Note**: Tags are clickable and searchable in Obsidian

### Relationships

#### `updated`
- **Type**: Date
- **Obsidian Type**: Date property
- **Description**: Date of last significant update
- **Example**: `2025-12-13`

#### `dependencies`
- **Type**: List
- **Obsidian Type**: List property
- **Description**: Other prompts that must be completed before this one
- **Example**:
  ```yaml
  dependencies:
    - 02-turborepo-refined
    - 03-setup-database
  ```

#### `blocks`
- **Type**: List
- **Obsidian Type**: List property
- **Description**: Other prompts that are blocked by this one
- **Example**:
  ```yaml
  blocks:
    - 05-implement-api
  ```

#### `related_specs`
- **Type**: List
- **Obsidian Type**: List property (accepts [[links]])
- **Description**: Links to specification documents
- **Example**:
  ```yaml
  related_specs:
    - "[[specifications/auth-service-spec]]"
  ```
- **Note**: Links are clickable in Obsidian's property view

#### `related_planning`
- **Type**: List
- **Obsidian Type**: List property (accepts [[links]])
- **Description**: Links to planning/brainstorming documents
- **Example**:
  ```yaml
  related_planning:
    - "[[planning/architecture-brainstorming]]"
  ```

### Optional

#### `notesProperties (Quick Start)

For quick drafts, use this minimal version:

```yaml
---
title: Prompt title
id: XX-slug-name
created: 2025-12-13
status: draft
executed_date: 
execution_result: pending
deprecated: false
target: backend
complexity: moderate
tags:
  - tag1
---
```

> **Tip**: In Obsidian, you can add properties using the "+ Add property" button in the properties panel!
## Minimal Header (Quick Start)

For quick drafts, use this minimal version:

```markdown
---yaml
---
title: Implement Blocklist Sync API
id: 05-blocklist-sync-api
created: 2025-12-14
updated: 2025-12-14
status: draft
executed_date: 
execution_result: pending
deprecated: false
deprecated_reason: 
target: backend
complexity: moderate
tags:
  - sync
  - api
  - blocklist
dependencies:
  - 03-turborepo-refined
blocks:
  - 06-chrome-ext-sync
related_specs:
  - "[[specifications/sync-api-spec]]"
related_planning:
  - "[[planning/architecture-brainstorming]]"
notes: Must handle conflicts when multiple devices update simultaneously
---
```

### Example 2: Executed Prompt

```yaml
---
title: Setup Turborepo Monorepo Structure
id: 03-turborepo-refined
created: 2025-12-10
updated: 2025-12-12
status: executed
executed_date: 2025-12-12
execution_result: success
deprecated: false
deprecated_reason: 
target: infrastructure
complexity: moderate
tags:
  - monorepo
  - turborepo
  - setup
dependencies:
  - 02-turborepo-initial
blocks:
  - 04-shared-types
  - 05-sync-api
related_specs: []
related_planning:
  - "[[planning/architecture-brainstorming]]"
notes: Successfully migrated extension to apps/ and setup pnpm workspaces
---
```

### Example 3: Deprecated Prompt

```yaml
---
title: Initial Turborepo Setup (Draft)
id: 02-turborepo-initial
created: 2025-12-10
updated: 2025-12-10
status: deprecated
executed_date: 
execution_result: pending
deprecated: true
deprecated_reason: Refined and replaced with more detailed version
target: infrastructure
complexity: moderate
tags:
  - monorepo
  - turborepo
  - deprecated
dependencies: []
blocks: []
related_specs: []
related_planning: []
notes: Initial draft was too vague, see refined version
updated: 2025-12-10
status: deprecated
executed_date: null
execution_result: pending
deprecated: true
deprecated_reason: "Refined and replaced with more detailed version"
deprecated_by: "03-turborepo-refined"
target: infrastructure
priority: medium
estimated_time: "2 hours"
complexity: moderate
tags:properties template
2. Fill in required fields: `title`, `id`, `created`, `status`, `target`, `tags`
3. Leave `executed_date` empty and set `execution_result: pending`
4. Set `deprecated: false` (checkbox unchecked)
5. Add other properties as needed using Obsidian's property panel

### When Executing a Prompt

1. Update `status: executed` (use dropdown)
2. Set `executed_date` to today's date (use date picker)
3. Set `execution_result: success | partial | failed` (use dropdown)
4. Update `updated` field to today
5. Add notes about execution in the `notes` property

### When Deprecating a Prompt

1. Set `status: deprecated` (use dropdown)
2. Check the `deprecated` checkbox (set to `true`)
3. Fill in `deprecated_reason` text
4. Add `deprecated` to tags

### Maintenance

- Update the `updated` date property whenever making significant changes
- Keep tags consistent across prompts for better searchability
- Link related documents using Obsidian `[[links]]` in list properties
- Review and update dependencies/blocks as project evolves
- Use Obsidian's property panel for easy editing

### Obsidian Property Types Configuration

To get the best visual experience, configure these property types in Obsidian:

1. **Text properties as dropdowns**: `status`, `execution_result`, `complexity`, `target`
   - Right-click property → Type → Text
   - Add common values for dropdown suggestions

2. **Date properties**: `created`, `updated`, `executed_date`
   - Right-click property → Type → Date
   - Enables date picker

3. **Checkbox properties**: `deprecated`
   - Right-click property → Type → Checkbox
   - Shows as toggle

4. **List properties**: `tags`, `dependencies`, `blocks`, `related_specs`, `related_planning`
   - Right-click property → Type → List or Tags
   - Enables multi-value input
3. Set `execution_result: success | partial | failed`
4. Update `updated` field
5. Add notes about execution in the `notes` field

### When Deprecating a Prompt

1. Set `status: deprecated`
2. Set `deprecated: true`
3. Fill in `deprecated_reason`
4. If replaced, set `deprecated_by` to new prompt ID
5. Add `deprecated` tag

### Maintenance

- Update the `updated` field whenever making significant changes
- Keep tags consistent across prompts for better searchability
- Link related documents using Obsidian `[[links]]`
- Review and update dependencies/blocks as project evolves

---

## Querying with Dataview (Obsidian Plugin)

If using Dataview plugin, you can query prompts:

### All Pending Prompts
```dataview
TABLE status, priority, target, estimated_time
FROM "prompts"
WHERE status = "ready" AND execution_result = "pending"
SORT priority DESC
```

### Recently Executed
```dataview
TABLE executed_date, execution_result, target
FROM "prompts"
WHERE status = "executed"
SORT executed_date DESC
LIMIT 10
```

### Deprecated Prompts
```dataview
TABLE deprecated_reason, deprecated_by
FROM "prompts"
WHERE deprecated = true
```

---

*Last updated: 2025-12-13*
