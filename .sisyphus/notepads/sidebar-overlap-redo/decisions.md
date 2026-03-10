# Decisions

- Chose to align the desktop spacer collapsed formula to the fixed sidebar formula (`+ 2px`) instead of changing fixed width, because the fixed element defines the true occupied width on screen.
- Kept scope to one class token update in `Sidebar` so expanded and mobile behaviors remain untouched.
- During retry, reverted all listed unrelated files and retained only sidebar layout-engine adjustments needed for verification and collapsed-width parity.
- Retry #2 decision: keep dependency arrays unchanged and preserve only the spacer width parity delta in `sidebar.tsx`.
