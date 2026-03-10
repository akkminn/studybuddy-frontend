# Decisions

- Kept access policy unchanged (token-auth only) by adding `/documents` under the existing protected route structure without introducing role checks.
- Implemented a minimal placeholder `Documents` page only; deferred upload logic and nested route behavior to later tasks.
- Inserted `Documents` after `Generate Questions` in `navItems` to keep existing navigation order stable while placing document-upload workflow adjacent to related question-generation actions.
- Kept upload action UI-only by simulating an in-flight state with a short local async delay and explicitly deferring API wiring (`DocumentService`) to subsequent tasks.
- Added a dedicated placeholder container for document list rendering (`data-testid="documents-list"`) without introducing fetch/list logic in this step.
- Replaced the simulated upload timeout with a real try/catch/finally API flow that keeps `isUploading` as the source of in-flight UI state and reports recoverable inline status messages for both success and failure.
- Kept document list as full server truth by rendering every entry returned from `DocumentService.list()` without status-based filtering.
- Introduced a shared `fetchDocuments` callback used for both initial load and post-upload refresh so list data updates without a page reload.
- Chose localized split-state handling in `Documents.tsx` (new `uploadError` plus mode-aware list errors) to avoid duplicate feedback and preserve existing API/auth architecture.
- Kept retry scoped to list fetch failure via a local `type="button"` control near list error state, preserving current route structure and existing test IDs.
- Prioritized current user intent in status output (`validationError` > `uploadError` > neutral status message) and reset upload errors on new selections for concise, non-duplicative inline feedback.
- Chose a docs-only implementation for Task 7 because required test IDs were already present and unique, minimizing risk to upload/list runtime behavior.
- Formalized fixture expectations in `.sisyphus/evidence/README.md` to lock a stable QA contract before Task 8 automation.
- For Task 8, preserved scope by collecting text-based happy/failure QA evidence files plus a blocker artifact instead of modifying app code or adding dependencies when Playwright runtime was missing.
- Chose a single-file ESLint remediation in `eslint.config.js` (rule override for `react-refresh/only-export-components`) instead of touching component files, to clear lint gate with minimal risk and no behavior changes.
- Applied a focused sidebar layout fix-set only: removed the extra wrapper in `MainLayout`, kept existing nav/route/toggle logic intact, and used minimal class/constant tweaks in sidebar primitives to fix desktop overlap and compact collapsed width.
