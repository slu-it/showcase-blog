# Frontend – Claude Guidance

## Project Overview

Angular 20 single-page application for a blog platform. Supports reading, creating, editing, and deleting blog posts with markdown content. Multi-language (EN, DE, ES, SV). Talks to a backend via a `/api` prefix.

**Stack at a glance:**

| Concern | Technology |
|---|---|
| Framework | Angular 20 (standalone components) |
| Language | TypeScript 5.8 (strict mode) |
| Build | @angular/build (Esbuild) |
| Styling | SCSS + CSS custom properties |
| State | Angular Signals |
| HTTP | `@angular/common/http` + RxJS |
| i18n | @ngx-translate |
| Unit tests | Jest 29 + jest-preset-angular |
| E2E tests | Playwright 1.58 |
| Lint | ESLint 9 flat config + angular-eslint + typescript-eslint |
| Container | Docker multi-stage → nginx |

---

## Commands

This project uses **pnpm**. Do not use npm or yarn.

```bash
pnpm start              # Dev server at http://localhost:4200
pnpm run start:open     # Dev server bound to 0.0.0.0 (container use)
pnpm run build          # Production build → dist/
pnpm test               # Jest unit tests
pnpm run test:watch     # Jest in watch mode
pnpm run test:coverage  # Jest with coverage report → coverage/
pnpm run lint           # ESLint
pnpm run e2e            # Playwright E2E (starts dev server automatically)
pnpm run e2e:ui         # Playwright with interactive UI
```

### Installing dependencies

```bash
pnpm add <package>          # Add a runtime dependency
pnpm add -D <package>       # Add a dev dependency
pnpm install                # Install all dependencies from pnpm-lock.yaml
```

---

## Architecture

### Source layout

```
src/
  main.ts                      # Bootstrap
  app/
    app.ts                     # Root component
    app.routes.ts              # Route definitions
    app.config.ts              # provideRouter, provideHttpClient, etc.
    common/                    # Shared components & services
      blog-posts/              # BlogPostsService + sub-components (editor, preview, view)
      context/                 # ContextService – current user & permissions
      notifications/           # NotificationsService – toast messages
      action-button/
      confirmation-dialog/
      error-state/
      markdown-renderer/
      test-data-generator/     # Admin-only tool
    views/                     # Page-level components (one per route)
      blog-post-list/
      blog-post-creator/
      blog-post-editor/
      blog-post-viewer/
  styles.scss                  # Global styles
  _variables.scss              # CSS custom property definitions
public/
  assets/
    i18n/                      # en.json, de.json, es.json, sv.json
    img/
e2e/                           # Playwright tests
  pages/                       # Page Object Models
  api.stubs.ts                 # Route stubs for API mocking
```

### Routes

| Path | Component |
|---|---|
| `/` | BlogPostList |
| `/create` | BlogPostCreator |
| `/edit/:uid` | BlogPostEditor |
| `/view/:uid` | BlogPostViewer |

### Key services

- **ContextService** – fetches `GET /api/context` on app init; exposes `user` signal (username, `isAuthor`, `isAdmin` flags).
- **BlogPostsService** – CRUD wrapper over `/api/blog-posts`. All methods return Observables; side-effects (success/error toasts) are applied via `tap()`.
- **NotificationsService** – Signal-based toast queue, auto-dismissed after 3 s.

### API contract

```
GET    /api/blog-posts?pageNumber=&pageSize=   → BlogPostsPage (HAL)
GET    /api/blog-posts/:uid
POST   /api/blog-posts                         → BlogPostDto
PATCH  /api/blog-posts/:uid                    → BlogPostUpdateDto
DELETE /api/blog-posts/:uid
GET    /api/context                            → User
```

Responses follow HAL (`_embedded`, `_links`). PATCH/DELETE availability is indicated by the presence of `_links.patch` / `_links.delete` on each post.

---

## Coding Conventions

### TypeScript

- **Strict mode is on.** No `any`, no implicit `any`, `noImplicitReturns`, `noFallthroughCasesInSwitch`.
- Standalone components only – no NgModules.
- Use Angular Signals for component/service state; use RxJS Observables for HTTP calls.
- Keep private mutable signals (`_foo = signal(...)`) and expose read-only aliases (`readonly foo = this._foo.asReadonly()`).

### Components

- Selectors: `app-` prefix, **kebab-case** (e.g. `app-blog-post-list`).
- Directives: `app` prefix, **camelCase**.
- One component per file; file name matches selector without prefix.
- Template file: `.component.html`, styles: `.component.scss`.
- Unit test: `.component.spec.ts` co-located with the component.

### Styles

- SCSS for all stylesheets; inline style language is SCSS.
- Theme values live in `src/_variables.scss` as CSS custom properties on `:root`.
- `stylePreprocessorOptions.includePaths` includes `src/`, so `@use 'variables'` works from anywhere.
- No external CSS framework – custom styles only.
- Component bundles have a 4 kB warning / 8 kB error budget; keep styles lean.

### i18n

- All user-visible strings go through `@ngx-translate` (`translate` pipe or `TranslateService.instant()`).
- Translation keys live in `public/assets/i18n/*.json`.
- Fallback language: `en`. Language preference is persisted in `localStorage`.

---

## Testing

### Unit tests (Jest)

- Co-locate spec files with the source (`*.spec.ts`).
- Use `jest-preset-angular`; environment is jsdom.
- Import from `src/` using the `src/` path alias (configured in `moduleNameMapper`).
- Exclude from coverage: `main.ts`, `*.d.ts`, `*.routes.ts`, environment files.

### E2E tests (Playwright)

- Tests live in `e2e/`; use the Page Object Model pattern (`e2e/pages/`).
- API calls are mocked via `page.route()` using stubs from `api.stubs.ts`.
- Base URL is `http://localhost:4200`; Playwright starts the dev server automatically.
- CI retries: 2; workers: 1. Locally runs fully parallel.

---

## Linting

ESLint 9 flat config (`eslint.config.js`). Run with `npm run lint`.

- TypeScript files: `typescript-eslint` recommended + stylistic rules.
- Angular files: `angular-eslint` recommended template rules including accessibility checks.
- Semicolons are required.

---

## Keeping This File Up to Date

Whenever you make changes that affect anything documented in this file, update this file to reflect those changes. This includes:

- Stack versions (framework, language, tooling)
- Commands or scripts
- Source layout (new directories, moved files, renamed components)
- Routes
- Key services or their behaviour
- API contract (new endpoints, changed response shapes)
- Coding conventions
- Testing setup or configuration
- Linting configuration
- Docker build process

Update the relevant section(s) as part of the same task, not as a follow-up.

---

## Docker

Multi-stage `Dockerfile`:
1. **builder** – `node:20-alpine`, runs `npm ci && ng build`.
2. **runtime** – `nginx:alpine`, serves `dist/frontend/browser/` on port 80.

`nginx.conf` routes all requests to `/index.html` for client-side routing.
