# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (port 5173)
npm run build        # Production build
npm run start        # Serve production build (port 3000)
npm run typecheck    # TypeScript type checking + React Router typegen
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
```

To run a single test file:
```bash
npx jest path/to/file.test.ts
```

## Architecture

**Stack**: React 19 + React Router 7 (SPA mode) + Vite + TailwindCSS/DaisyUI + TypeScript

**What this app does**: Video management platform — upload videos to S3, request transcoding to multiple resolutions, and play back via HLS streaming.

### Source Layout (`app/`)

- **routes/**: Page components (`home`, `upload`, `video-detail`, `player`) — defined in `routes.ts`
- **services/**: API layer — `api-client.ts` is the base fetch wrapper; other services (`video-service`, `upload-service`, `transcode-service`, `stream-service`) build on it
- **hooks/**: Custom hooks for data fetching and state — `useUpload` orchestrates multi-phase upload flow, `useHlsPlayer` wraps HLS.js, polling hooks for async operations
- **components/**: Organized by domain (`common/`, `layout/`, `player/`, `transcode/`, `upload/`, `video/`)
- **types/**: TypeScript DTOs matching backend API contracts
- **lib/format.ts**: Formatting utilities (duration, bytes, dates, resolution)

### Key Patterns

- **No global state management** — hooks manage local and server state directly
- **Polling for async operations** — upload processing and transcode jobs use polling hooks with intervals
- **Upload flow phases**: `idle` → `initializing` (get S3 URL) → `uploading` (direct S3 PUT with XHR progress) → `calling-back` (notify backend) → `polling` (wait for processing) → `done`
- **API client**: `api.get/post/delete<T>()` with generic typing, base URL from `VITE_API_BASE_URL` env var, all routes prefixed `/api/v1`
- **HLS playback**: HLS.js with native Safari fallback in `useHlsPlayer`
- **Path alias**: `~/*` maps to `./app/*`

### Styling

- TailwindCSS + DaisyUI components (night theme with purple accent)
- Theme colors defined in `app/app.css`

### Testing

- Jest 30 + React Testing Library + jsdom environment
- Tests located in `__tests__/` directories alongside source
- CSS mocked via identity-obj-proxy, static assets via fileMock

### Deployment

- **Docker**: Multi-stage build → node:20-alpine, serves on port 3000
- **Cloudflare Workers**: Configured in `wrangler.jsonc`, SPA mode
