# Mila Dating App

Mila is a mobile-first dating product focused on thoughtful discovery, safer introductions, voice assistance, and clear relationship preferences. This repository contains the interactive web product preview and the foundation for testing and production delivery.

## Local development

Requirements: Node.js 22+ and npm.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

`npm run verify` runs type checking, unit tests, and the production build.

## Docker testing environment

```bash
docker compose up --build
```

Open `http://localhost:3000`. The container exposes `/api/health` for health checks. Docker is the repeatable test/staging runtime; production is deployed to the existing Worker-based Mila environment.

## Environments

- Development: local `npm run dev`
- Testing/staging: Docker and pull-request checks
- Production: versioned Worker deployment after all checks pass

Copy `.env.example` to `.env.local` for local-only configuration. Never commit secrets.

See [Production readiness](docs/PRODUCTION_READINESS.md) for the path from this product preview to live accounts, payments, messaging, moderation, and native apps.

The responsive web product is available at `/web`. See [Application architecture](docs/ARCHITECTURE.md) for the 19-table data model and service boundaries.
