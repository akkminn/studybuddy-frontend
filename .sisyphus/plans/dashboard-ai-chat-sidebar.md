# Dashboard AI Chat Sidebar UI Plan

## TL;DR
> **Summary**: Add a new protected dashboard page for `Chat with AI Agent` with static example conversation bubbles and expose it through the existing sidebar navigation.
> **Deliverables**:
> - New chat page component with seeded demo messages
> - New protected route at `/chat-agent`
> - New sidebar nav item pointing to the chat page
> - Agent-executed verification evidence for auth + UI behavior
> **Effort**: Short
> **Parallel**: YES - 2 waves
> **Critical Path**: Task 1 -> Task 2 -> Task 4

## Context
### Original Request
Add Chat with AI agent UI in dashboard, show example chat messages, and display it in sidebar navigation.

### Interview Summary
- Confirmed chat should appear as a new sidebar navigation item.
- Confirmed first version is static demo messages only.
- Confirmed no new test framework setup in this iteration.

### Metis Review (gaps addressed)
- Guardrail added to prevent scope creep into backend chat, persistence, streaming, or send logic.
- Acceptance criteria include both unauthenticated redirect and authenticated render checks.
- Path/label defaults fixed to `/chat-agent` and `Chat with AI Agent`.

## Work Objectives
### Core Objective
Deliver a dashboard-visible, sidebar-accessible AI chat UI page that renders static sample chat messages and follows existing app patterns.

### Deliverables
- `src/pages/ChatAgent.tsx` page with static seeded user/assistant message bubbles.
- Route registration inside protected dashboard shell in `src/App.tsx`.
- Sidebar registration entry in `src/components/AppSidebar.tsx`.
- Evidence artifacts for build and browser QA in `.sisyphus/evidence/`.

### Definition of Done (verifiable conditions with commands)
- `npm run build` exits with code 0.
- Unauthenticated navigation to `/chat-agent` redirects to `/login`.
- Authenticated navigation to `/chat-agent` shows heading and seeded messages.
- Sidebar contains `Chat with AI Agent` and marks it active on `/chat-agent`.

### Must Have
- New nav item in existing `navItems` pattern in `src/components/AppSidebar.tsx`.
- New protected route in `src/App.tsx` under `MainLayout`.
- Static message list with at least 6 message bubbles and clear user/assistant visual distinction.
- UI composition aligned with existing dashboard page style patterns.

### Must NOT Have (guardrails, AI slop patterns, scope boundaries)
- No API calls or service-layer integration for chat.
- No websocket/streaming/persistence/state sync.
- No role-based gating additions unless already present in current sidebar architecture.
- No introduction of test frameworks or CI pipelines in this task.
- No refactor of global layout, auth guard, or sidebar primitives.

## Verification Strategy
> ZERO HUMAN INTERVENTION - all verification is agent-executed.
- Test decision: none (no new test infra) + `npm run build` plus browser automation QA.
- QA policy: Every task contains executable happy-path and edge-case scenarios.
- Evidence: `.sisyphus/evidence/task-{N}-{slug}.{ext}`.

## Execution Strategy
### Parallel Execution Waves
> Target: 5-8 tasks per wave. <3 per wave (except final) = under-splitting.
> Extract shared dependencies as Wave-1 tasks for max parallelism.

Wave 1: route and navigation foundation tasks (`quick`, `visual-engineering`).
Wave 2: chat page UI composition and integration validation (`visual-engineering`, `unspecified-low`).

### Dependency Matrix (full, all tasks)
- Task 1 blocks Tasks 2 and 4.
- Task 2 blocks Task 4.
- Task 3 blocks Task 5.
- Task 4 blocks Task 5.
- Task 5 blocks Task 6.
- Task 6 feeds Final Verification Wave.

### Agent Dispatch Summary (wave -> task count -> categories)
- Wave 1 -> 3 tasks -> `quick`, `visual-engineering`.
- Wave 2 -> 3 tasks -> `visual-engineering`, `unspecified-low`.
- Final Wave -> 4 tasks -> `oracle`, `unspecified-high`, `deep`.

## TODOs
> Implementation + Test = ONE task. Never separate.
> EVERY task MUST have: Agent Profile + Parallelization + QA Scenarios.

- [ ] 1. Create static chat page scaffold and seed data

  **What to do**: Create `src/pages/ChatAgent.tsx` with a local constant array containing at least 6 seeded messages split across `user` and `assistant`; include page heading `Chat with AI Agent` and dashboard-style container composition.
  **Must NOT do**: Do not import services, call APIs, or add message send logic.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: UI page composition with existing dashboard look-and-feel.
  - Skills: [`frontend-ui-ux`] - Reason: ensures intentional message bubble hierarchy and responsive layout.
  - Omitted: [`playwright`] - Reason: implementation task only; browser automation occurs in QA steps.

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: 2, 5, 6 | Blocked By: none

  **References** (executor has NO interview context - be exhaustive):
  - Pattern: `src/pages/GenerateQuestion.tsx` - follow existing dashboard page card and spacing style.
  - Pattern: `src/pages/Dashboard.tsx` - align page-level heading/content conventions.
  - API/Type: `src/types/type.ts` - avoid coupling static UI to backend response types.
  - Test: `package.json` - use existing scripts only (`build`, `dev`).

  **Acceptance Criteria** (agent-executable only):
  - [ ] `src/pages/ChatAgent.tsx` exists and exports default React component.
  - [ ] File contains seeded local messages (>=6) with both `user` and `assistant` roles.
  - [ ] Component renders heading text `Chat with AI Agent`.

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```text
  Scenario: Happy path scaffold validation
    Tool: Bash
    Steps: Run `npm run build` after creating file and imports are valid.
    Expected: Build succeeds with exit code 0.
    Evidence: .sisyphus/evidence/task-1-chat-scaffold-build.txt

  Scenario: Failure/edge case import break detection
    Tool: Bash
    Steps: If build fails, capture TypeScript error output related to ChatAgent component before fixing.
    Expected: Error output clearly identifies missing/incorrect import path.
    Evidence: .sisyphus/evidence/task-1-chat-scaffold-error.txt
  ```

  **Commit**: NO | Message: `feat(chat): scaffold static chat page` | Files: `src/pages/ChatAgent.tsx`

- [ ] 2. Register protected route for chat page

  **What to do**: Update `src/App.tsx` to import `ChatAgent` and add route path `/chat-agent` inside the protected `MainLayout` route branch.
  **Must NOT do**: Do not modify auth logic in `ProtectedRoute` or route hierarchy outside dashboard-protected area.

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: focused route registration change in one file.
  - Skills: [] - Reason: no special skill required for route wiring.
  - Omitted: [`frontend-ui-ux`] - Reason: this task is routing, not visual design.

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: 4, 6 | Blocked By: 1

  **References** (executor has NO interview context - be exhaustive):
  - Pattern: `src/App.tsx` - existing protected route composition under `MainLayout`.
  - Pattern: `src/components/ProtectedRoute.tsx` - preserve current auth-gate behavior.
  - Pattern: `src/components/MainLayout.tsx` - route target must render within outlet shell.

  **Acceptance Criteria** (agent-executable only):
  - [ ] `src/App.tsx` includes `ChatAgent` import.
  - [ ] Route `/chat-agent` exists under protected dashboard routes.
  - [ ] No change to `/login` and existing routes behavior.

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```text
  Scenario: Happy path protected route wiring
    Tool: Playwright
    Steps: Set `localStorage.access_token=demo-token`, open `/chat-agent`.
    Expected: URL remains `/chat-agent` and heading `Chat with AI Agent` is visible.
    Evidence: .sisyphus/evidence/task-2-route-happy.png

  Scenario: Failure/edge case unauthenticated redirect
    Tool: Playwright
    Steps: Clear localStorage and open `/chat-agent`.
    Expected: Redirect to `/login`.
    Evidence: .sisyphus/evidence/task-2-route-redirect.png
  ```

  **Commit**: NO | Message: `feat(routes): add protected chat-agent route` | Files: `src/App.tsx`

- [ ] 3. Add sidebar navigation entry for chat

  **What to do**: Update `src/components/AppSidebar.tsx` `navItems` to include `Chat with AI Agent` pointing to `/chat-agent` with a Lucide icon consistent with existing list styling.
  **Must NOT do**: Do not create a new nav section or alter logout behavior.

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: constrained navigation item addition.
  - Skills: [] - Reason: existing pattern is straightforward.
  - Omitted: [`frontend-ui-ux`] - Reason: minimal visual logic change.

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: 5, 6 | Blocked By: none

  **References** (executor has NO interview context - be exhaustive):
  - Pattern: `src/components/AppSidebar.tsx` - modify existing `navItems` array and keep active-path match semantics.
  - Pattern: `src/components/ui/sidebar.tsx` - preserve sidebar item/button structure.
  - Pattern: `src/components/NavBar.tsx` - keep sidebar toggle flow unchanged.

  **Acceptance Criteria** (agent-executable only):
  - [ ] Sidebar renders link text `Chat with AI Agent`.
  - [ ] Link href/path target is `/chat-agent`.
  - [ ] Active style applies when current path is `/chat-agent`.

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```text
  Scenario: Happy path sidebar navigation
    Tool: Playwright
    Steps: Login state set via localStorage token, open dashboard, click `Chat with AI Agent` in sidebar.
    Expected: URL changes to `/chat-agent` and clicked item has active-state styling.
    Evidence: .sisyphus/evidence/task-3-sidebar-happy.png

  Scenario: Failure/edge case stale path mismatch
    Tool: Playwright
    Steps: Navigate to `/dashboard` and assert `Chat with AI Agent` is not marked active.
    Expected: Chat nav item is visible but inactive.
    Evidence: .sisyphus/evidence/task-3-sidebar-inactive.png
  ```

  **Commit**: NO | Message: `feat(sidebar): add chat with ai agent nav item` | Files: `src/components/AppSidebar.tsx`

- [ ] 4. Compose chat message bubble UI and responsive behavior

  **What to do**: In `src/pages/ChatAgent.tsx`, render seeded messages as visually distinct user/assistant bubbles with responsive wrapping and spacing suitable for desktop/mobile within current dashboard layout.
  **Must NOT do**: Do not add message input submission, loading states, or optimistic updates.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: styling and responsive UI behavior are primary.
  - Skills: [`frontend-ui-ux`] - Reason: maintain non-generic but consistent conversation visual hierarchy.
  - Omitted: [`playwright`] - Reason: implementation first; validation covered in QA task.

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: 6 | Blocked By: 1, 2

  **References** (executor has NO interview context - be exhaustive):
  - Pattern: `src/pages/GenerateQuestion.tsx` - card header/content composition style.
  - Pattern: `src/components/ui/textarea.tsx` - optional visual parity for static composer-like area if included, without behavior.
  - Pattern: `src/components/ui/input-group.tsx` - optional structural inspiration only; no send action wiring.

  **Acceptance Criteria** (agent-executable only):
  - [ ] At least one user bubble and one assistant bubble are rendered with distinct alignment/styling.
  - [ ] Total rendered bubbles is >=6.
  - [ ] Layout remains readable at mobile viewport width 375px and desktop width 1280px.

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```text
  Scenario: Happy path conversation rendering
    Tool: Playwright
    Steps: Set auth token, open `/chat-agent`, count rendered message bubble elements.
    Expected: Count >= 6 and heading visible.
    Evidence: .sisyphus/evidence/task-4-bubbles-happy.png

  Scenario: Failure/edge case responsive overflow
    Tool: Playwright
    Steps: Resize viewport to 375x812 and inspect for horizontal overflow.
    Expected: No horizontal scrollbar and message text remains visible.
    Evidence: .sisyphus/evidence/task-4-bubbles-mobile.png
  ```

  **Commit**: NO | Message: `feat(chat-ui): render static user and assistant bubbles` | Files: `src/pages/ChatAgent.tsx`

- [ ] 5. Validate sidebar-route integration and active-state fidelity

  **What to do**: Verify end-to-end navigation from sidebar to chat route and ensure active-state highlighting logic remains correct across dashboard and chat routes.
  **Must NOT do**: Do not refactor sidebar matching logic beyond what is needed for `/chat-agent` inclusion.

  **Recommended Agent Profile**:
  - Category: `unspecified-low` - Reason: integration validation across existing components.
  - Skills: [`playwright`] - Reason: browser-level assertions required.
  - Omitted: [`frontend-ui-ux`] - Reason: no design implementation change.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 6 | Blocked By: 2, 3, 4

  **References** (executor has NO interview context - be exhaustive):
  - Pattern: `src/components/AppSidebar.tsx` - active-state and link rendering.
  - Pattern: `src/App.tsx` - route-to-page mapping for `/chat-agent`.
  - Pattern: `src/components/MainLayout.tsx` - shell-level rendering where sidebar persists across routes.

  **Acceptance Criteria** (agent-executable only):
  - [ ] Clicking `Chat with AI Agent` from sidebar navigates to `/chat-agent`.
  - [ ] Chat nav item is active on `/chat-agent` and inactive on `/dashboard`.
  - [ ] Existing sidebar items still navigate correctly.

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```text
  Scenario: Happy path nav round-trip
    Tool: Playwright
    Steps: Open `/dashboard`, click chat nav item, then click dashboard nav item.
    Expected: Route transitions work both directions and active item updates each time.
    Evidence: .sisyphus/evidence/task-5-nav-roundtrip.png

  Scenario: Failure/edge case broken href detection
    Tool: Playwright
    Steps: Attempt navigation by sidebar click and assert route path exactly equals `/chat-agent`.
    Expected: No 404/intermediate unexpected path.
    Evidence: .sisyphus/evidence/task-5-nav-path-check.png
  ```

  **Commit**: NO | Message: `test(nav): verify chat sidebar routing integration` | Files: `.sisyphus/evidence/*`

- [ ] 6. Final build and static-scope compliance verification

  **What to do**: Execute final build and browser verification to confirm feature works and no backend/network chat integration was introduced.
  **Must NOT do**: Do not add or configure unit/E2E frameworks in repository for this task.

  **Recommended Agent Profile**:
  - Category: `unspecified-low` - Reason: final validation and evidence collection.
  - Skills: [`playwright`] - Reason: browser checks and network assertions.
  - Omitted: [`frontend-ui-ux`] - Reason: no additional UI authoring.

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: Final Verification Wave | Blocked By: 1, 2, 3, 4, 5

  **References** (executor has NO interview context - be exhaustive):
  - Pattern: `package.json` - build command and scripts.
  - Pattern: `src/services/authService.ts` - keep chat page independent from service calls.
  - Pattern: `src/services/instance.ts` - confirm no new API dependency added for chat UI.

  **Acceptance Criteria** (agent-executable only):
  - [ ] `npm run build` passes.
  - [ ] Browser test confirms unauthenticated `/chat-agent` redirects to `/login`.
  - [ ] Browser test confirms authenticated `/chat-agent` renders chat heading + bubbles.
  - [ ] Network interception shows no chat API endpoint requests from chat page render.

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```text
  Scenario: Happy path final verification
    Tool: Bash
    Steps: Run `npm run build`.
    Expected: Exit code 0.
    Evidence: .sisyphus/evidence/task-6-build-final.txt

  Scenario: Failure/edge case static-only guarantee
    Tool: Playwright
    Steps: Open `/chat-agent` with auth token and capture network requests during initial render.
    Expected: No request URL includes `chat`, `message`, `ai`, `socket`, or websocket upgrades.
    Evidence: .sisyphus/evidence/task-6-network-static-check.json
  ```

  **Commit**: YES | Message: `feat(dashboard): add static AI chat page with sidebar navigation` | Files: `src/pages/ChatAgent.tsx`, `src/App.tsx`, `src/components/AppSidebar.tsx`

## Final Verification Wave (4 parallel agents, ALL must APPROVE)
- [ ] F1. Plan Compliance Audit - oracle
- [ ] F2. Code Quality Review - unspecified-high
- [ ] F3. Real Manual QA - unspecified-high (+ playwright if UI)
- [ ] F4. Scope Fidelity Check - deep

## Commit Strategy
- Single feature commit after all acceptance criteria pass.
- Commit message: `feat(dashboard): add static AI chat page with sidebar navigation`.
- Files expected: `src/pages/ChatAgent.tsx`, `src/App.tsx`, `src/components/AppSidebar.tsx`.

## Success Criteria
- Users with valid auth can open `/chat-agent` from the sidebar.
- Page shows static seeded user/assistant conversation with consistent styling.
- Unauthorized access is redirected by existing protected-route flow.
- Build and agent-executed QA scenarios pass with stored evidence files.
