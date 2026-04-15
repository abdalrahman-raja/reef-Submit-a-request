# Repository Guidelines

## Project Structure & Module Organization
This repository contains two primary TypeScript/React applications, each following a full-stack architecture with a React frontend, an Express backend, and a shared module.

- **Root Project**: The main application located in the root directory.
  - `client/`: React 19 frontend managed by Vite.
  - `server/`: Express backend (entry point: `server/index.ts`).
  - `shared/`: Shared TypeScript types and logic used by both client and server.
- **Dashboard Project (`dashboard/`)**: A specialized portal for managing requests.
  - `dashboard/client/`: React 19 frontend with tRPC integration.
  - `dashboard/server/`: Express backend using tRPC and Drizzle ORM (entry point: `server/_core/index.ts`).
  - `dashboard/shared/`: Shared modules for the dashboard.
  - `dashboard/drizzle/`: Database migrations and configuration.

## Build, Test, and Development Commands
Both projects use `pnpm` as the package manager and have independent build/dev pipelines.

### Root Project Commands
- **Development**: `pnpm dev` (runs Vite dev server)
- **Build**: `pnpm build` (builds client with Vite and server with esbuild)
- **Production Start**: `pnpm start` (runs the built server from `dist/index.js`)
- **Type Check**: `pnpm check`
- **Format**: `pnpm format`

### Dashboard Project Commands
Navigate to `dashboard/` before running these:
- **Development**: `pnpm dev` (uses `tsx watch` for the backend)
- **Build**: `pnpm build` (Vite + esbuild)
- **Database Migrations**: `pnpm db:push` (Drizzle)
- **Run Tests**: `pnpm test` (Vitest)

## Coding Style & Naming Conventions
- **Formatting**: Enforced by Prettier (defined in [./.prettierrc](./.prettierrc)). Run `pnpm format` to apply.
- **TypeScript**: Strict mode is enabled in both projects. Path aliases are used:
  - `@/*` maps to `./client/src/*`
  - `@shared/*` maps to `./shared/*`
- **React**: Uses React 19 features and Radix UI components for styling and accessibility.
- **Backend**: Express-based, with the dashboard project leveraging tRPC for type-safe API communication.

## Testing Guidelines
Testing is primarily focused on the dashboard project using **Vitest**. Run `pnpm test` within the `dashboard/` directory to execute tests.

## Commit & Pull Request Guidelines
Commit messages follow a standard "Initial commit" pattern for new repositories. Ensure code passes `pnpm check` and `pnpm format` before submitting changes.
