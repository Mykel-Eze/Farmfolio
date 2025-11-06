# Copilot / AI Agent Instructions — Farmfolio

Short, actionable guidance to help an AI agent be productive in this repo.

1. High-level architecture
   - React single-page app bootstrapped with Vite (`vite.config.js`). Dev server runs on port 3000.
   - Routing handled by `react-router-dom` in `src/App.jsx`. Protected routes use `components/auth/PrivateRoute.jsx` and the `AuthContext`.
   - Client state: lightweight global state via `AuthContext` + `useAuth` hook (localStorage backed). Some other libs (Zustand) may be used in parts.
   - Server comms via Axios instances in `src/api/axiosConfig.js` and small service modules in `src/api/*` (e.g. `authApi.js`, `producerProfilesApi.js`).

2. Key developer workflows / commands
   - Start dev server: `npm run dev` (runs `vite`, auto-opens at port 3000).
   - Build: `npm run build` -> `dist/` with sourcemaps.
   - Preview production build: `npm run preview`.
   - Lint: `npm run lint`.
   - Environment variables must use the `REACT_APP_` prefix (set in `vite.config.js` via `envPrefix`).

3. Auth & API conventions (most critical)
   - Token management: token and user are stored in localStorage keys defined in `src/utils/constants.js` (look for `STORAGE_KEYS`).
   - Axios interceptors (in `src/api/axiosConfig.js`) automatically attach `Authorization: Bearer <token>` and handle common status codes (401 -> clear storage + redirect to `/login`, 400 validation errors, 404 not found).
   - Use `createFormData` helper in `axiosConfig.js` for file uploads and arrays (the helper appends arrays and files correctly).
   - Services in `src/api/*` return `response.data` — code often handles multiple response shapes (see `src/context/AuthContext.jsx` for examples of robust response handling).

4. Patterns & conventions to follow when editing/adding code
   - Prefer small service modules in `src/api/` that use the shared axios instance. Example: `authApi.login(credentials)`.
   - When adding routes, follow the `ROUTES` constants in `src/utils/constants.js` and protect via `PrivateRoute` for authenticated pages.
   - Use the `useAuth` hook (`src/hooks/useAuth.js`) inside components — it throws if used outside `AuthProvider`.
   - Keep API calls idempotent and surface useful errors; the app expects error objects shaped like `{ message, errors? }` from axios helpers.
   - React Query is used (`@tanstack/react-query`) with a global client in `src/main.jsx`; follow its default options (retry=2, staleTime=5m).

5. Useful file references (start here)
   - `vite.config.js` — alias `@` -> `src`, env prefix, dev port
   - `package.json` — scripts (`dev`, `build`, `preview`, `lint`)
   - `src/api/axiosConfig.js` — axios instance, interceptors, `createFormData`, `buildQueryString`, `retryRequest`
   - `src/api/authApi.js` — auth service usage examples
   - `src/context/AuthContext.jsx` & `src/hooks/useAuth.js` — authentication flow and localStorage conventions
   - `src/App.jsx` — routes and usage of `PrivateRoute` + examples of public vs protected pages

6. Common pitfalls & how to handle them
   - Unexpected API response shapes: Auth code defensively tries multiple shapes (token/user vs nested `data`). Mirror that when calling backend endpoints.
   - Multipart requests: let `createFormData` build FormData and ensure the Axios request does NOT set Content-Type (axiosConfig removes it when FormData is used).
   - 401 behavior: axios interceptor will clear localStorage and redirect — avoid double-redirect loops by ensuring `_retry` flag or other guards when re-trying requests.
   - Environment variables: remember `REACT_APP_` prefix; otherwise Vite won't expose them to client code.

7. When proposing changes (PRs)
   - Reference the affected API service and include a short note about the expected server response shape used in the change.
   - Add or update a small runtime check if you rely on new ENV vars (fail-fast with a clear console error).

If anything here is unclear or you want more examples (component-level patterns, tests to add, or where to plug feature flags), tell me which area to expand and I will iterate.
