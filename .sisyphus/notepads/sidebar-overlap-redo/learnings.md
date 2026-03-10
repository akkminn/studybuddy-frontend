# Learnings

- In `src/components/ui/sidebar.tsx`, desktop collapsed spacing must match the fixed sidebar collapsed width exactly; even a `2px` drift causes visible main-content intrusion under the fixed rail.
- For `floating`/`inset` variants, the spacer and fixed sidebar both need `calc(var(--sidebar-width-icon) + theme(spacing.4) + 2px)` in collapsed icon mode.
- Retry cleanup confirmed scope can be reduced to sidebar-only code diff while preserving the same collapsed-width parity fix.

- QA rerun on desktop (1024/1280) still showed sidebar/main overlap in both expanded and collapsed states; spacer measured 0px while fixed sidebar remained visible.
