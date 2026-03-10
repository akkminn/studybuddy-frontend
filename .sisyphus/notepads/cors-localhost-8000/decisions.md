# Decisions

- Reused `VITE_API_PREFIX` as the single source for both axios base path and Vite proxy key, with `/api` fallback when env is missing.
- Scoped proxy behavior to Vite development server only; production/non-dev axios base URL still resolves from `VITE_API_BASE_URL + VITE_API_PREFIX`.
- Left auth interceptors and refresh-token flow intact; only base URL/proxy routing behavior changed.
- Retry correction: rolled back non-CORS refactors in `src/services/instance.ts` and retained only dev base URL routing plus Vite proxy changes.
