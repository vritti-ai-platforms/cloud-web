# vritti-cloud-web - Gemini CLI Context

This project is a React web application built with React 19, Tailwind CSS v4, and the `@vritti/quantum-ui` component library.

## Project Structure
- `src/components/`: Reusable UI components.
- `src/hooks/`: TanStack Query hooks.
- `src/pages/`: Page-level components.
- `src/services/`: API client functions (pure axios).
- `src/schemas/`: Zod validation schemas.

## Core Conventions
- **React Import**: Always use `import type React from 'react'`.
- **Components**: Use `@vritti/quantum-ui` components. Never use HTML `<button>` or raw shadcn.
- **Styling**: Tailwind CSS v4 only. Never hardcode colors; use semantic tokens (`primary`, `success`, `destructive`, etc.).
- **Forms**: Use `react-hook-form` + `zod` + quantum-ui `<Form>`. Always enable `showRootError` for forms that receive general API errors.
- **API Flow**: Services (Axios) → Hooks (TanStack Query) → Pages.

## Available Skills
- `vritti-ui-builder`: Use this for building/modifying UI components, forms, and pages.
- `quantum-ui-architect`: Use this for core design system and component library tasks.

## Rules
Detailed coding rules are available in `.gemini/rules/`.
- `frontend-conventions.md`: Component usage and styling rules.
- `frontend-file-structure.md`: How to organize the project.
- `frontend-hook.md` / `frontend-service.md`: API integration patterns.
- `error-handling.md`: How to handle and display API errors.

## Development
- `pnpm dev`: Start development server on `http://local.vrittiai.com:3001`.
- `USE_HTTPS=true pnpm dev`: Start on `https://local.vrittiai.com:3001`.
