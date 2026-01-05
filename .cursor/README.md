# .cursor Overview

This repository uses a worker-first `.cursor/` directory as the "unconscious context" for both #developer and #agent.

## Structure

- `rules/` – Core instructions and architecture
- `procedures/` – Step-by-step processes to execute work
- `tasks/` – Work items described as MDC files
- `lessons/` – Reusable insights extracted from runbooks
- `runbooks/` – Execution logs/summaries for tasks
- `decisions/` – ADRs (optional, future)
- `scripts/` – TypeScript utilities (indexers, scaffolding)

## Scripts

- `pnpm run task:new -- --name "Title" [--type chore] [--status backlog]`
  - Creates `task-NNN.mdc` with minimal header
- `pnpm run index:tasks` | `index:rules` | `index:procedures` | `index:lessons` | `index:decisions`
  - Generates `INDEX.json` for each area
- `pnpm run index:all`
  - Generates all indexes in one go

## Install & Use

- Requires Node 22+, pnpm, Parcel for app dev
- Dev setup for scripts: `pnpm install`
- Tasks: create via `task:new`; execute via procedures; document via runbooks; extract lessons when reusable

## Vision (MCP Alignment)

- TypeScript scripts evolve into MCP tools
- Shared types under `.cursor/types/` (planned)
- CI can verify consistency (unique task numbers, valid headers)
- See `./rules/mcp-future.mdc` for details

## Conventions

- Use `.mdc` for worker docs under `.cursor/`
- Use #notation for concepts (see `./rules/dict.mdc`)
- Avoid duplicating rules; link to `rules/` documents
