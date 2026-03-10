# Student Document Upload Page (Authenticated)

## TL;DR
> **Summary**: Add a new authenticated dashboard page for single-file document upload and server-backed document display, using existing document/auth services.
> **Deliverables**:
> - New `Documents` page and route
> - Sidebar navigation entry
> - Single upload flow with clear UX states
> - Post-upload server-refresh document list with status display
> - Agent-executed QA evidence + lint/build verification
> **Effort**: Medium
> **Parallel**: YES - 3 waves
> **Critical Path**: Task 1 -> Task 3 -> Task 4 -> Task 5 -> Task 8

## Context
### Original Request
- Implement a document upload feature for student dashboard as a new page.
- Provide clear UI/UX flow.
- Display uploaded document after completion.
- Use Document APIs from `http://localhost:8000/docs#/`.
- Document APIs are authenticated; update auth code if needed.

### Interview Summary
- v1 scope is **single upload only**.
- Route access remains **any authenticated user** (current app pattern).
- After successful upload, list is **server-confirmed via re-fetch**.
- Test strategy: **manual agent QA + lint/build** (no test infra setup in this item).

### Metis Review (gaps addressed)
- Guardrails added against scope creep (no batch upload/delete/pagination).
- Explicit decision to show server list with status badge and include completed uploads visibly.
- Explicit handling for upload-success but list-refresh-failure split state.
- Explicit QA policy to avoid duplicate toast/inline error confusion.

## Work Objectives
### Core Objective
Deliver a production-ready authenticated `Documents` page where users upload one file and immediately see authoritative document records from backend state.

### Deliverables
- New page component: `src/pages/Documents.tsx`
- Route registration in `src/App.tsx`
- Sidebar nav registration in `src/components/AppSidebar.tsx`
- Reuse existing `DocumentService` and types without backend changes
- UI states: idle, selecting file, uploading, refresh loading, success, failure

### Definition of Done (verifiable conditions with commands)
- `npm run lint` exits 0.
- `npm run build` exits 0.
- Authenticated upload through UI returns success feedback and refreshed list row.
- Unauthenticated API path triggers redirect/login behavior via existing interceptor flow.

### Must Have
- New route path: `/documents`
- Sidebar item title: `Documents`
- Single-file upload using `DocumentService.upload(file)`
- Post-success re-fetch using `DocumentService.list()`
- Display all returned documents with explicit status badge; completed entries clearly visible
- File input accepts only `.pdf,.txt,.md`

### Must NOT Have (guardrails, AI slop patterns, scope boundaries)
- No batch upload UI
- No delete action
- No pagination/sorting/filter drawer
- No polling loop
- No changes to backend API contracts
- No auth architecture rewrite (token keys/interceptor contract unchanged)

## Verification Strategy
> ZERO HUMAN INTERVENTION - all verification is agent-executed.
- Test decision: none (no new framework) + existing `npm run lint` and `npm run build`
- QA policy: Every task includes happy + failure scenario with concrete actions
- Evidence: `.sisyphus/evidence/task-{N}-{slug}.{ext}`

## Execution Strategy
### Parallel Execution Waves
Wave 1: routing and navigation wiring + page scaffold
Wave 2: upload/list data flow and UX states
Wave 3: validation, edge handling, and verification hardening

### Dependency Matrix (full, all tasks)
- Task 1 blocks Tasks 3, 7
- Task 2 depends on Task 1
- Task 3 blocks Tasks 4, 5, 6
- Task 4 blocks Task 5
- Task 5 blocks Task 8
- Task 6 depends on Tasks 4 and 5
- Task 7 depends on Task 2
- Task 8 depends on Tasks 5, 6, 7

### Agent Dispatch Summary (wave -> task count -> categories)
- Wave 1 -> 2 tasks -> `quick`, `visual-engineering`
- Wave 2 -> 3 tasks -> `visual-engineering`, `unspecified-low`
- Wave 3 -> 3 tasks -> `unspecified-low`, `quick`

## TODOs
> Implementation + Test = ONE task. Never separate.
> EVERY task has Agent Profile + Parallelization + QA Scenarios.

- [x] 1. Add documents route and page registration

  **What to do**: Create `src/pages/Documents.tsx` using existing dashboard page structure; import it into `src/App.tsx`; register `<Route path="/documents" element={<Documents/>}/>` inside the existing `ProtectedRoute` + `MainLayout` block.
  **Must NOT do**: Do not add nested routes, role guard wrappers, or route aliases.

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: isolated route wiring and page scaffold.
  - Skills: `[]` - no special skill required.
  - Omitted: `[frontend-ui-ux]` - full styling polish happens in Task 3.

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: 3, 7 | Blocked By: none

  **References**:
  - Pattern: `src/App.tsx:22` - protected/layout nesting location.
  - Pattern: `src/App.tsx:26` - existing route style under `MainLayout`.
  - Pattern: `src/pages/MyQuizzes.tsx:1` - simple page component style baseline.
  - API/Type: `src/components/ProtectedRoute.tsx:3` - token-only route access policy.

  **Acceptance Criteria**:
  - [ ] `grep "path=\"/documents\"" src/App.tsx` returns one route line.
  - [ ] `npm run build` exits 0 after route/page wiring.

  **QA Scenarios**:
  ```
  Scenario: Route resolves for authenticated session
    Tool: Playwright
    Steps: Set localStorage access_token on app origin; navigate to /documents.
    Expected: Documents page renders without redirect to /login.
    Evidence: .sisyphus/evidence/task-1-route-auth.png

  Scenario: Route redirects when unauthenticated
    Tool: Playwright
    Steps: Clear localStorage access_token and refresh /documents.
    Expected: Browser redirects to /login.
    Evidence: .sisyphus/evidence/task-1-route-unauth.png
  ```

  **Commit**: YES | Message: `feat(documents): add documents route scaffold` | Files: `src/App.tsx`, `src/pages/Documents.tsx`

- [x] 2. Add sidebar navigation entry for documents

  **What to do**: Add `Documents` item to `navItems` in `src/components/AppSidebar.tsx` with href `/documents` and a lucide icon (`FileUp`).
  **Must NOT do**: Do not reorder existing nav items or modify logout behavior.

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: single-file nav config update.
  - Skills: `[]` - no additional skill needed.
  - Omitted: `[git-master]` - no git operation needed.

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: 7 | Blocked By: 1

  **References**:
  - Pattern: `src/components/AppSidebar.tsx:13` - nav item array structure.
  - Pattern: `src/components/AppSidebar.tsx:58` - active state behavior.
  - Pattern: `src/App.tsx:27` - route href naming convention.

  **Acceptance Criteria**:
  - [ ] `grep "Documents" src/components/AppSidebar.tsx` returns new nav label.
  - [ ] Clicking sidebar `Documents` navigates to `/documents`.

  **QA Scenarios**:
  ```
  Scenario: Sidebar navigation to documents page
    Tool: Playwright
    Steps: Login or seed token; click sidebar item labeled Documents.
    Expected: URL becomes /documents and item shows active state.
    Evidence: .sisyphus/evidence/task-2-sidebar-nav.png

  Scenario: Existing nav items unaffected
    Tool: Playwright
    Steps: Click Dashboard then return to Documents.
    Expected: Both routes still load correctly; no console errors.
    Evidence: .sisyphus/evidence/task-2-sidebar-regression.png
  ```

  **Commit**: YES | Message: `feat(documents): add sidebar navigation item` | Files: `src/components/AppSidebar.tsx`

- [x] 3. Implement upload form UX and local validation states

  **What to do**: Build the `Documents` page UI with sections for file selection, upload button, inline status area, and documents table placeholder. Add deterministic selectors: `data-testid="documents-file-input"`, `documents-upload-btn`, `documents-status-msg`, `documents-list`.
  **Must NOT do**: Do not introduce drag-and-drop, batch inputs, or chunk-size controls in v1.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: user-facing flow and state presentation.
  - Skills: `[frontend-ui-ux]` - enforce clear and intentional UX hierarchy.
  - Omitted: `[dev-browser]` - implementation task, not automation task.

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: 4, 5, 6 | Blocked By: 1

  **References**:
  - Pattern: `src/pages/Register.tsx:56` - form wiring + submit state pattern.
  - Pattern: `src/pages/Dashboard.tsx:61` - loading/error state rendering style.
  - Pattern: `src/components/ui/card.tsx:1` - card composition primitives.

  **Acceptance Criteria**:
  - [ ] File input only accepts `.pdf,.txt,.md`.
  - [ ] Upload button disabled when no file or upload is in-flight.
  - [ ] All required `data-testid` attributes exist in rendered markup.

  **QA Scenarios**:
  ```
  Scenario: Valid file selection enables upload
    Tool: Playwright
    Steps: Navigate /documents; upload fixture sample.pdf into documents-file-input.
    Expected: documents-upload-btn becomes enabled.
    Evidence: .sisyphus/evidence/task-3-valid-file.png

  Scenario: Invalid extension rejected before submit
    Tool: Playwright
    Steps: Try selecting fixture invalid.exe.
    Expected: Inline validation appears in documents-status-msg and upload button remains disabled.
    Evidence: .sisyphus/evidence/task-3-invalid-file.png
  ```

  **Commit**: YES | Message: `feat(documents): add upload form UI states` | Files: `src/pages/Documents.tsx`

- [x] 4. Integrate authenticated single upload API call

  **What to do**: On submit, call `DocumentService.upload(selectedFile)`; handle request lifecycle (`isUploading`, success message, failure message) and rely on existing axios interceptors for auth headers/refresh behavior.
  **Must NOT do**: Do not duplicate bearer token header logic in page code.

  **Recommended Agent Profile**:
  - Category: `unspecified-low` - Reason: straightforward service integration.
  - Skills: `[]` - existing service contract already defined.
  - Omitted: `[frontend-ui-ux]` - no additional visual scope beyond Task 3.

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: 5, 6 | Blocked By: 3

  **References**:
  - API/Type: `src/services/documentService.ts:12` - single upload method.
  - API/Type: `src/types/type.ts:104` - `DocumentResponse` contract.
  - Pattern: `src/services/instance.ts:16` - auth header injection mechanism.

  **Acceptance Criteria**:
  - [ ] Upload request uses `DocumentService.upload` only.
  - [ ] During upload, button shows in-progress state and prevents duplicate submit.
  - [ ] Failure state shows a recoverable inline error message.

  **QA Scenarios**:
  ```
  Scenario: Successful upload call
    Tool: Playwright
    Steps: Select valid file; click documents-upload-btn once.
    Expected: In-flight state visible; then success message appears in documents-status-msg.
    Evidence: .sisyphus/evidence/task-4-upload-success.png

  Scenario: Unauthorized upload path
    Tool: Playwright
    Steps: Remove access_token and trigger upload request.
    Expected: Existing auth flow redirects to /login (or blocks with auth error) without page crash.
    Evidence: .sisyphus/evidence/task-4-upload-unauthorized.png
  ```

  **Commit**: YES | Message: `feat(documents): wire authenticated upload action` | Files: `src/pages/Documents.tsx`

- [x] 5. Fetch and render server-backed document list after upload

  **What to do**: Load list on page mount via `DocumentService.list()`, then re-fetch after successful upload. Render all documents in a table/list including filename, file type, created timestamp, and status badge (pending/processing/completed/failed). Ensure completed documents are visually obvious.
  **Must NOT do**: Do not filter list to completed-only; show full server truth with status indicators.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: data presentation + status UX clarity.
  - Skills: `[frontend-ui-ux]` - enforce readable information hierarchy.
  - Omitted: `[playwright]` - QA is separate.

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: 8 | Blocked By: 4

  **References**:
  - API/Type: `src/services/documentService.ts:36` - list endpoint wrapper.
  - API/Type: `src/types/type.ts:110` - `DocumentListResponse`.
  - API/Type: `src/types/type.ts:4` - `DocumentStatus` values.
  - Pattern: `src/pages/Dashboard.tsx:31` - initial data fetch and loading lifecycle.

  **Acceptance Criteria**:
  - [ ] Initial page load performs one `list()` call and renders records.
  - [ ] Successful upload triggers re-fetch and updates rendered list.
  - [ ] Status badge displayed for every row; completed status is clearly distinguishable.

  **QA Scenarios**:
  ```
  Scenario: List refresh after successful upload
    Tool: Playwright
    Steps: Open /documents with token; capture initial row count; upload sample.pdf; wait for success.
    Expected: documents-list updates (count increases or new filename appears) after re-fetch.
    Evidence: .sisyphus/evidence/task-5-list-refresh.png

  Scenario: List fetch failure handling
    Tool: Playwright
    Steps: Simulate backend unavailable (stop API) and load /documents.
    Expected: Non-blocking error state appears with retry action; page shell remains usable.
    Evidence: .sisyphus/evidence/task-5-list-failure.png
  ```

  **Commit**: YES | Message: `feat(documents): render server-backed document list` | Files: `src/pages/Documents.tsx`

- [x] 6. Handle split-state errors and avoid duplicate feedback

  **What to do**: Ensure page messaging differentiates upload failure vs list-refresh failure (e.g., "Upload succeeded, list refresh failed"). Keep inline messages concise and non-duplicative with global toasts.
  **Must NOT do**: Do not suppress interceptor toasts globally; scope fixes to page-level copy/state only.

  **Recommended Agent Profile**:
  - Category: `unspecified-low` - Reason: error-state logic refinement.
  - Skills: `[]` - no extra libraries required.
  - Omitted: `[frontend-ui-ux]` - only copy/state adjustment.

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: 8 | Blocked By: 4,5

  **References**:
  - Pattern: `src/services/instance.ts:149` - global error toast behavior.
  - Pattern: `src/pages/Login.tsx:112` - focused inline action feedback style.
  - Pattern: `src/pages/Register.tsx:39` - submit error handling baseline.

  **Acceptance Criteria**:
  - [ ] Upload success + list failure emits clear split-state inline message.
  - [ ] User can retry list fetch without re-uploading file.

  **QA Scenarios**:
  ```
  Scenario: Upload success then refresh failure
    Tool: Playwright
    Steps: Start upload; disable backend before post-upload list call.
    Expected: UI shows upload success with separate refresh-failed notice and retry control.
    Evidence: .sisyphus/evidence/task-6-split-state.png

  Scenario: Retry list recovers state
    Tool: Playwright
    Steps: Re-enable backend; click retry list button.
    Expected: documents-list renders current server state and error notice clears.
    Evidence: .sisyphus/evidence/task-6-retry-recovery.png
  ```

  **Commit**: YES | Message: `fix(documents): clarify upload and refresh error states` | Files: `src/pages/Documents.tsx`

- [x] 7. Add deterministic selectors and QA fixture contract for automation

  **What to do**: Confirm stable `data-testid` hooks are present for upload input/button/status/list; define fixture file names used by QA (`sample.pdf`, `invalid.exe`, `sample.md`) in `.sisyphus/evidence/README.md` instructions.
  **Must NOT do**: Do not add runtime app dependencies for testing.

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: deterministic selector + docs-only support.
  - Skills: `[]` - straightforward.
  - Omitted: `[playwright]` - this task prepares, does not execute automation.

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: 8 | Blocked By: 2

  **References**:
  - Pattern: `src/pages/Register.tsx:68` - stable input ids and structure.
  - Pattern: `src/pages/Register.tsx:174` - stable submit control location.

  **Acceptance Criteria**:
  - [ ] All four required testids exist and are unique.
  - [ ] QA fixture contract documented in `.sisyphus/evidence/README.md`.

  **QA Scenarios**:
  ```
  Scenario: Selectors discoverable
    Tool: Playwright
    Steps: Snapshot /documents accessibility tree and query testids.
    Expected: documents-file-input, documents-upload-btn, documents-status-msg, documents-list found.
    Evidence: .sisyphus/evidence/task-7-selectors.json

  Scenario: Missing fixture failure clarity
    Tool: Bash
    Steps: Run QA script without sample.pdf fixture.
    Expected: Script exits non-zero with explicit missing-fixture message.
    Evidence: .sisyphus/evidence/task-7-fixture-error.txt
  ```

  **Commit**: YES | Message: `chore(documents): add deterministic QA hooks` | Files: `src/pages/Documents.tsx`, `.sisyphus/evidence/README.md`

- [x] 8. Execute verification gate and capture evidence

  **What to do**: Run lint/build and full scripted UI/API QA matrix for this feature, store outputs/screenshots in `.sisyphus/evidence/`.
  **Must NOT do**: Do not mark complete without evidence artifacts for both happy and failure paths.

  **Recommended Agent Profile**:
  - Category: `unspecified-low` - Reason: verification orchestration.
  - Skills: `[playwright]` - required for browser flow checks.
  - Omitted: `[frontend-ui-ux]` - no UI changes in this task.

  **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: none | Blocked By: 5,6,7

  **References**:
  - Command: `package.json:6` - lint command.
  - Command: `package.json:7` - build command.
  - API: `src/services/documentService.ts:18` - upload endpoint behavior.

  **Acceptance Criteria**:
  - [ ] `npm run lint` exits 0 and output saved to `.sisyphus/evidence/task-8-lint.txt`.
  - [ ] `npm run build` exits 0 and output saved to `.sisyphus/evidence/task-8-build.txt`.
  - [ ] Happy/failure UI QA artifacts exist for upload and list refresh paths.

  **QA Scenarios**:
  ```
  Scenario: Full happy path regression
    Tool: Playwright
    Steps: Login/token seed -> /documents -> select sample.pdf -> upload -> wait refresh.
    Expected: Success message + list entry visible + no uncaught console errors.
    Evidence: .sisyphus/evidence/task-8-happy.png

  Scenario: Failure path regression
    Tool: Playwright
    Steps: Use invalid.exe then trigger upload.
    Expected: Validation error shown; no request submission; app remains interactive.
    Evidence: .sisyphus/evidence/task-8-failure.png
  ```

  **Commit**: NO | Message: `n/a` | Files: `.sisyphus/evidence/*`

## Final Verification Wave (4 parallel agents, ALL must APPROVE)
- [x] F1. Plan Compliance Audit - oracle
- [x] F2. Code Quality Review - unspecified-high
- [x] F3. Real Manual QA - unspecified-high (+ playwright if UI)
- [x] F4. Scope Fidelity Check - deep

## Commit Strategy
- Commit 1: `feat(documents): add documents page route and sidebar navigation`
- Commit 2: `feat(documents): implement single upload flow with server-refreshed list`
- Commit 3: `chore(documents): finalize validation and QA hardening`

## Success Criteria
- Users can open `/documents` when authenticated.
- Users can upload one valid file (`pdf/txt/md`) and receive clear success/error feedback.
- Uploaded/processed document appears in server-driven list with visible status.
- No regressions to existing auth/routing, verified by lint + build + scripted QA evidence.
