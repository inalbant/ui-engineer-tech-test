# Yantra Trade Blotter

The front-end app for the tech test. Read [`docs/BRIEF.md`](../docs/BRIEF.md)
first — it describes the task and what we evaluate. This file covers how
to run the code.

## Stack

- **Next.js 16.1.6** (App Router) + React 19 + TypeScript strict
- **Redux Toolkit + RTK Query** (server + client state)
- **redux-persist** (persists UI state across refreshes)
- **styled-components**, with design-system tokens as CSS custom properties
  (`lib/ds/tokens.css`) and the legacy theme (`lib/theme.ts`) still in use
  on unmigrated screens
- **Vitest + React Testing Library**

## Prerequisites

- Node 20+
- The FastAPI backend running on `localhost:8000` (see the top-level
  `README.md`). The backend must be running before `npm run dev`.

## Commands

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck    # tsc --noEmit
npm run test         # vitest
npm run build        # next build
```

## Environment

| Variable | Default | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8000` | REST base for the FastAPI backend. |
| `NEXT_PUBLIC_WS_URL` | `ws://localhost:8000/ws/assistant` | WebSocket for the assistant stream. |

## Project layout

```
src/
  app/
    layout.tsx              # Provider, PersistGate, ThemeProvider chain
    page.tsx                # redirects → /trades
    providers.tsx
    registry.tsx            # StyledComponentsRegistry for App Router SSR
    trades/
      page.tsx              # trades list
      [id]/page.tsx         # detail
  components/
    AppShell.tsx            # top-level chrome + drawer mount
    TradesTable.tsx
    StatusFilter.tsx
    TradeMetadata.tsx
    EmailsPanel.tsx
    NotesPanel.tsx
    AssistantDrawer.tsx
    ui/                     # Button, Badge, Card, Panel, EmptyState, Spinner, Dialog
  lib/
    schemas.ts              # hand-written zod mirroring the Pydantic models
    format.ts               # formatNotional, formatDate, formatDateTime
    ds/tokens.css           # design-system tokens (generated, do not hand-edit)
    theme.ts                # legacy styled-components theme
    store.ts                # configureStore + redux-persist config
    hooks.ts                # typed useAppDispatch/useAppSelector
    globalStyle.ts          # createGlobalStyle reset + base typography
    ws.ts                   # assistant WebSocket hook
    api/
      tradesApi.ts          # RTK Query createApi + tags
    slices/
      uiSlice.ts            # drawer open/closed (persisted)
  test/
    setup.ts, helpers.tsx
    TradesTable.test.tsx    # passing
    NotesPanel.test.tsx     # passing
    format.test.ts          # passing
    ws.test.ts              # skipped (known timing issue — not expected to be fixed)
```

## Resetting the backend database

From the repo root:

```bash
uv run python -m src.seed
```

This drops back to 40 trades, 125 emails, 26 notes.
