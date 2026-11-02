# Yantra front-end test

Welcome. Yantra builds capital-markets ops tooling — deterministic rules
and LLM calls working together to streamline trade-break reconciliation.

This repo is your working environment for the test.

**Start here: [`docs/BRIEF.md`](docs/BRIEF.md).** It describes the task,
what we evaluate, and what to submit. This README just covers getting the
stack running.

## What's in here

- `docs/` — the task brief, plus the audit, decisions and AI usage templates.
- `design/reference.html` — the design reference. Open it directly in a browser.
- `frontend/` — a Next.js 16.1.6 trade management app. This is where you work.
- `src/` — a FastAPI backend (Python 3.13 + SQLite) that the front end talks to.
- `data/trades.db` — pre-populated database (40 trades, 125 emails, 26 notes).

## Getting the stack running

Run the API in Docker and the front end directly — that way you get hot
reload on the front end code you're actually changing.

**Terminal 1 — API (Docker):**

```bash
docker compose up
```

The API server will be available at http://localhost:8000 (interactive docs at `/docs`).

**Terminal 2 — front end:**

```bash
cd frontend
npm install
npm run dev
```

The front end dev server will start and be accessible at http://localhost:3000.

> **No Docker?** Run the API directly instead:
> ```bash
> uv sync
> uv run uvicorn src.main:app --reload
> ```

## API reference

| Method | Path | Purpose |
|--------|------|---------|
| `GET`  | `/api/trades` | List trades; filter by status with `?status=dispute` (repeatable). |
| `GET`  | `/api/trades/{trade_id}` | Single trade with its emails and notes. |
| `POST` | `/api/trades/{trade_id}/notes` | Submit a note. Only `dispute` trades accept it; returns `400` otherwise. |
| `WS`   | `/ws/assistant` | Streaming assistant. Receives `{"message": "..."}`, streams back `{"token": "..."}` frames, ends each reply with `{"done": true}`. The connection stays open for further messages. |

Full interactive docs at http://localhost:8000/docs once the API is running.

## Resetting the database

If you break the local database during development:

```bash
uv run python -m src.seed
```

This restores it to the original 40 trades, 125 emails, and 26 notes.
