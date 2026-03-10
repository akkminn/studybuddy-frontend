# Draft: Document Upload Backend Integration

## Requirements (confirmed)
- "skip the UI testing process like using playwieght"
- "we will only focus on the task need to done"
- "we don't play with existing UI code"
- "focus only on integration with backend API"

## Technical Decisions
- Planning mode only; no source-code implementation in this session.
- Exclude Playwright/UI testing from verification strategy.
- Preserve existing UI components/pages; backend integration layer only.
- Primary implementation focus: response mapping/type contract alignment for document upload/list APIs.
- Verification strategy: lightweight service-layer automated tests (no UI tests).

## Research Findings
- `src/pages/Documents.tsx` owns upload orchestration and local upload/list state (`selectedFile`, `isUploading`, `statusMessage`, error states).
- `src/services/documentService.ts` centralizes upload/list/get/delete/chunks/health API calls.
- `src/services/instance.ts` handles axios base URL resolution, auth token injection, 401 refresh, and global API error mapping.
- `src/types/type.ts` defines `DocumentResponse`, `DocumentListResponse`, `BatchUploadResponse`, `UploadOptions`; possible contract mismatch on allowed file types vs `DocumentType` enum.
- Test infra currently absent (`package.json` has no test runner/mock/playwright setup); lightweight checks available via `npm run lint` and `npm run build`.

## Open Questions
- None (cleared for plan generation).

## Scope Boundaries
- INCLUDE: Document upload backend API integration changes (plan only).
- EXCLUDE: Existing UI code changes; Playwright/UI test workflows.
