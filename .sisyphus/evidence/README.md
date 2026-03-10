# QA Fixture Contract

This directory defines deterministic fixture files for Task 8 upload automation against `src/pages/Documents.tsx` selectors.

## Required Fixtures

- `sample.pdf`: valid upload fixture; expected to pass client extension validation and proceed to upload flow.
- `invalid.exe`: invalid upload fixture; expected to be rejected by extension validation and surface the status error message.
- `sample.md`: valid upload fixture; expected to pass client extension validation and proceed to upload flow.

## Expected QA Usage

- Attach fixtures through `data-testid="documents-file-input"`.
- Trigger submit with `data-testid="documents-upload-btn"`.
- Assert inline feedback through `data-testid="documents-status-msg"`.
- Assert list region visibility/state through `data-testid="documents-list"`.
