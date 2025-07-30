# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Context0, a workflow automation platform built with Next.js 15. The application allows users to create, manage, and execute workflows through a visual flow editor, with support for external service integrations.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Type check TypeScript files
npm run check-types

# Lint code
npm run lint

# Format code with Prettier
npm run format

# Run all checks before commit
npm run test-all

# Database migrations
npm run db:migrate
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15.2.3 with App Router
- **Language**: TypeScript 5
- **Auth**: Clerk
- **State**: Zustand + React Query (TanStack Query)
- **UI**: Radix UI + shadcn/ui components + Tailwind CSS
- **Flow Editor**: @xyflow/react
- **Forms**: React Hook Form + Zod validation
- **Database**: Drizzle ORM

### Directory Structure

The codebase follows a feature-based organization pattern:

- `/src/actions/` - Server actions grouped by feature (analytics, billing, credential, workflow)
- `/src/api/` - API client functions for backend communication
- `/src/app/` - Next.js App Router pages and layouts
  - `(auth)` - Authentication pages
  - `(dashboard)` - Protected dashboard pages
  - `(landing_page)` - Public pages
  - `workflow/` - Workflow editor and execution views
- `/src/components/` - Reusable UI components
- `/src/schema/` - Zod schemas for validation
- `/src/types/` - TypeScript type definitions
- `/src/store/` - Zustand stores for client state

### Key Patterns

1. **Server Actions**: All server-side operations use Next.js server actions in `/src/actions/`. These handle authentication via Clerk and communicate with the Python backend.

2. **API Communication**: The app communicates with a Python backend at `PYTHON_BACKEND_HOST`. All API calls include authentication tokens from Clerk.

3. **Environment Variables**: Type-safe environment variables are defined in `/src/env/server.ts` using @t3-oss/env-nextjs. Required vars:
   - `PYTHON_BACKEND_HOST`
   - `API_SECRET`
   - `ENCRYPTION_KEY`

4. **Authentication Flow**: Clerk handles authentication. Protected routes check auth status and redirect to sign-in if needed.

5. **Workflow System**: Core feature allowing visual workflow creation with nodes/edges, execution tracking, and integration with external services (Discord, Slack, Google Drive, Notion).

## Important Considerations

1. **No Test Suite**: The project currently lacks testing infrastructure. When adding new features, consider that there are no existing test patterns to follow.

2. **Backend Dependency**: This frontend heavily depends on a Python backend API. Ensure the backend is running when developing features that require API calls.

3. **Type Safety**: The project uses TypeScript in strict mode. Always define proper types for new features.

4. **Server vs Client Components**: Be mindful of the "use client" directive. Components using hooks, state, or browser APIs need this directive.

5. **Credential Management**: The app handles sensitive credentials. Always use the encryption utilities when storing or retrieving credentials.