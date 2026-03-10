# Learnings

- Vite dev server proxying `VITE_API_PREFIX` to `http://localhost:8000` allows frontend calls to stay same-origin (`/api/...`) so browser CORS enforcement is bypassed in local development.
- Keeping axios base URL relative in `import.meta.env.DEV` preserves existing request and interceptor logic while routing through the Vite proxy.
