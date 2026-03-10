# Learnings

- Added new protected page routes by registering them inside the existing `ProtectedRoute` -> `MainLayout` route wrapper in `src/App.tsx`.
- Simple page scaffolds in this codebase use a centered container with a `Card` plus title, description, and placeholder body copy (see `MyQuizzes`/`Documents`).
- Sidebar navigation uses a `navItems` array with strict path matching (`activePath === item.href`), so adding `/documents` there automatically enables active-state styling without extra route logic.
- Documents upload UX now uses local-only file validation by extension (`.pdf`, `.txt`, `.md`) on input change so invalid files are rejected before submit.
- Added deterministic testing hooks to the upload flow (`documents-file-input`, `documents-upload-btn`, `documents-status-msg`, `documents-list`) to stabilize E2E and component test selectors.
- Documents submit flow now calls `DocumentService.upload(selectedFile)` directly, preserving existing extension validation and button-disable gating while using authenticated axios behavior from the shared instance.
- `Documents` now fetches `DocumentService.list()` on page load and again after successful upload so rendered rows always mirror server state.
- List rendering now explicitly handles loading, empty, and fetch-error states while keeping the existing `documents-list` test selector stable.
- Split upload and list-fetch outcomes by making `fetchDocuments` return success/failure and accept a mode (`load` vs `refresh`) so inline copy can reflect where the failure happened.
- Added an inline list retry button that calls the existing `fetchDocuments` callback, allowing refresh attempts without re-upload.
- Clearing `uploadError` on file-input changes prevents stale upload-failure feedback from persisting when users select a new file after an error.
- Task 7 confirmed all required deterministic selectors already exist and are unique in `src/pages/Documents.tsx` (`documents-file-input`, `documents-upload-btn`, `documents-status-msg`, `documents-list`), so no page refactor was needed.
- Added a dedicated QA fixture contract in `.sisyphus/evidence/README.md` that maps valid/invalid fixtures to expected upload behavior for upcoming automation.
- Task 8 verification gate: captured deterministic evidence artifacts in .sisyphus/evidence/task-8-* for lint/build plus UI happy/failure outcomes (blocked with explicit blocker file when Playwright runtime was unavailable).
- ESLint flat config can safely suppress Fast Refresh false positives by overriding `react-refresh/only-export-components` with `allowExportNames` for known non-component exports (`useTheme`, `badgeVariants`, `buttonVariants`) while keeping the rule enabled.
- Sidebar overlap was eliminated by restoring the canonical `SidebarProvider` sibling flow in `MainLayout` and preventing desktop sidebar shrink (`md:shrink-0`), so the reserved gap always matches the fixed rail.
- Collapsed icon rail can be made visibly tighter without behavior changes by shrinking `SIDEBAR_WIDTH_ICON` and pairing it with collapsed-only padding reductions on sidebar header/group/footer containers.
