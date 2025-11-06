# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MarketScan is a secure photography library application (photothèque) for the DGMP (Direction Générale des Marchés Publics) of Gabon. It manages construction site inspection missions, reports, photos, and metadata for public procurement monitoring and magazine publication.

## Development Commands

### Package Manager
Use **pnpm** for all package management operations.

### Core Development Commands
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production with Turbopack
- `pnpm start` - Start production server
- `pnpm lint` - Run Biome linter
- `pnpm format` - Format code with Biome

### Database Commands
- `pnpm db:push` - Push Prisma schema to database
- `pnpm db:seed` - Seed database with initial data
- `pnpm db:reset` - Reset database and re-seed
- `pnpm db:studio` - Open Prisma Studio for database management
- `pnpm prisma generate --no-engine` - Regenerate Prisma client (runs automatically on postinstall)

### Testing Single Features
To test specific components during development, navigate to the relevant route in the dev server:
- `/dashboard` - Main dashboard
- `/dashboard/missions` - Missions list
- `/dashboard/projects` - Projects list
- `/dashboard/companies` - Companies list
- `/dashboard/gallery` - Photo gallery
- `/dashboard/users` - User management (admin only)

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router (RSC-first)
- **Authentication**: Better Auth with email/password support
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS v4 with Shadcn UI components
- **Validation**: Zod schemas
- **Linting/Formatting**: Biome
- **Email**: Resend for transactional emails
- **File Storage**: Vercel Blob for mission photos

### Authentication & Authorization

The application uses Better Auth with a role-based access control system based on the specification requirements.

**User Roles** (defined in `src/lib/roles/get-roles.ts` and `src/lib/permissions/permissions.ts`):
- `u1` - Mission executor (create missions, view own reports)
- `u2` - Mission supervisor (validate reports, manage projects/companies/users)
- `u3` - Magazine editor (view validated reports and photos)
- `u4` - System administrator (full access, user management)

**Auth Configuration** (`src/lib/auth.ts`):
- Uses Prisma adapter with PostgreSQL
- Email verification enabled via Resend
- Admin plugin configured with role-based permissions
- Session management via better-auth

**Key Auth Actions** (`src/actions/`):
- `get-session.ts` - Server-side session retrieval
- `get-auth.ts` - Auth instance access
- `sign-in.ts`, `sign-out.ts`, `sign-up.ts` - Authentication flows
- `user/*` - User management (admin only)

### Database Schema

**Core Models** (see `prisma/schema.prisma`):

1. **User** - Better Auth user with role, ban status, phone number
2. **Session/Account/Verification** - Better Auth tables
3. **Contact** - Mission team members (unique email, name fields)
4. **Company** - Companies responsible for projects (unique email, NIF)
5. **Project** - Construction projects with status tracking
6. **Mission** - Inspection missions with team leader, members, dates
7. **MissionProject** - Junction table linking missions to projects with notes and files
8. **MissionFile** - Photos and documents uploaded for missions (stored in Vercel Blob)

**Key Relationships**:
- Mission → User (teamLeader)
- Mission → Contact[] (members, many-to-many)
- Mission → MissionProject[] → Project[]
- MissionProject → MissionFile[] (photos)
- Project → Company
- User → Session[], Account[]

**Enums**:
- `ProjectNature`: SUPPLY, SERVICES, INTELLECTUAL, PROGRAM, MIXED, CONTROLLED_EXPENSES
- `ProjectStatus`: UNCONTROLLED, CONTROLLED_IN_PROGRESS, CONTROLLED_DELIVERED, CONTROLLED_OTHER, DISPUTED
- `MissionStatus`: DRAFT, PENDING, COMPLETED, REJECTED

### Application Structure

**Server Actions Pattern** (`src/actions/`):
All mutations use Next.js Server Actions following this pattern:
- Input validation with Zod schemas
- Session/permission checks via `getSessionAction()`
- Database operations via Prisma
- Return type: `{ success: boolean, data?: T, error?: string }`
- Organized by domain: `mission/`, `project/`, `company/`, `contact/`, `user/`

**Component Architecture** (`src/components/`):
- **Domain Components**: Organized by feature (missions/, projects/, companies/, gallery/)
- **UI Components**: Shadcn UI components in `ui/` directory
- **Client Components**: Use `'use client'` sparingly, prefer RSC
- **Forms**: Use `useTransition` and `useActionState` for form handling (see Cursor rules)
- **Naming Convention**: Lowercase with dashes (e.g., `mission-form-client.tsx`)

**Routing** (`src/app/`):
- `/` - Public landing page
- `/auth/signin`, `/auth/signup`, `/auth/verify-email` - Authentication flows
- `/dashboard/*` - Protected dashboard routes
  - `/dashboard/missions` - Mission management (list, create, update, view)
  - `/dashboard/projects` - Project management with Kanban view
  - `/dashboard/companies` - Company management
  - `/dashboard/gallery` - Photo gallery with search/filters
  - `/dashboard/users` - User management (u2, u4 roles only)
  - `/dashboard/profile` - User profile editing
- `/api/auth/[...all]` - Better Auth API routes
- `/api/*` - REST API endpoints (see `/api-doc` for Swagger documentation)

**State Management**:
- Server state via React Server Components (RSC)
- Form state via `useActionState` and `useTransition`
- Minimal client-side state (avoid `useEffect`, `useState` when possible)

### Key Design Patterns

**Functional Programming**:
- Use consts instead of functions: `const handleClick = () => {}`
- Declarative over imperative
- Early returns for error conditions
- No classes, prefer functional components

**Form Handling** (from Cursor rules):
- Always use `useTransition` for async operations
- Use `useActionState` for form state management
- Use `useFormStatus` for loading states
- All forms submit to Server Actions

**File Organization**:
- Server components: Default export, async when needed
- Client components: `'use client'` directive at top
- Helpers/utilities: Named exports in `src/lib/`
- Schemas: Zod schemas in `src/models/`

**API Routes** (`src/app/api/`):
- REST endpoints with Swagger documentation
- Request/response schemas defined in `swagger-schemas.ts`
- Follow OpenAPI 3.0 specification
- Used for external integrations and mobile app

### Prisma Configuration

**Important**: Prisma client is generated to a custom location:
- Output path: `src/lib/generated/prisma`
- Always import from: `@/lib/generated/prisma`
- Database URL: `PRISMA_DATABASE_URL` env variable
- Provider: PostgreSQL

After schema changes:
1. Run `pnpm prisma generate --no-engine`
2. Run `pnpm db:push` to sync database

### Code Style Guidelines (from .cursor/rules/)

**TypeScript/React Best Practices**:
- Use TypeScript for all files
- Descriptive variable names with auxiliary verbs (`isLoading`, `hasError`)
- Early returns for error handling and guard clauses
- Accessibility: Add `aria-label`, `tabIndex`, keyboard handlers

**Styling**:
- Use Tailwind CSS classes exclusively (avoid inline CSS or style tags)
- Mobile-first responsive design
- Use Shadcn UI components from `@/components/ui/`

**Performance**:
- Minimize `'use client'` usage
- Implement dynamic imports for code splitting
- Optimize images (WebP format, lazy loading)
- Use React Server Components (RSC) by default

**Error Handling**:
- Custom error types for consistency
- User-friendly error messages in French
- Validation with Zod schemas
- Try-catch in Server Actions with proper error returns

### Environment Variables

Required environment variables (see `.env.local` template in README):
- `PRISMA_DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Auth encryption key
- `RESEND_API_KEY` - Email service API key
- `NEXT_PUBLIC_APP_URL` - Application URL
- `DISABLE_SIGN_UP` - Optional: Set to "true" to disable public signup
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token

### Multi-Language Support

**Current Language**: French
- All UI text is in French
- Date formatting uses `fr-FR` locale
- Error messages and validation in French
- Email templates in French

### Important Implementation Notes

1. **File Uploads**: Mission photos are uploaded to Vercel Blob storage. Metadata is extracted and stored in `MissionFile.metadata` as JSON string.

2. **Access Control**: Always check user role before rendering components or executing actions. Use the permission system defined in `src/lib/permissions/permissions.ts`.

3. **Mission Workflow**:
   - U1 creates missions (status: DRAFT)
   - U1 submits for review (status: PENDING)
   - U2/U4 reviews and validates/rejects missions
   - U3 can only view COMPLETED missions

4. **Data Integrity**: Email and NIF fields have unique constraints in Contact and Company models.

5. **Admin User**: Default admin user ID is hardcoded in `src/lib/auth.ts` - update this for production deployments.

6. **API Documentation**: Swagger UI available at `/api-doc` route for API exploration and testing.

7. **Kanban Views**: Projects and Missions both support Kanban board visualization with drag-and-drop status updates using `@dnd-kit`.

8. **Gallery Features**: Photo gallery supports searching by project, mission, date range, and other metadata with pagination.
