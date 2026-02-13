# Copilot Instructions for ElementalApp

## Project Architecture

This is an **apartment/payment management system** with a dual-app monorepo structure:
- **Frontend**: Next.js 16 app in `elemental/` with App Router, React 19, TypeScript, Tailwind CSS
- **Backend**: Strapi v5 CMS/API in `backend/` with SQLite (configurable to MySQL/PostgreSQL)

## Key Domain Concepts

**Core entities**: `Apartment` (properties) and `Payment` (financial transactions)
- Users can view apartments, track payments, and manage financial timelines
- JWT-based authentication with role-based access control via Strapi users-permissions

## Development Workflow

```bash
# Start both services (run in separate terminals)
cd elemental && pnpm dev    # Frontend: http://localhost:3000
cd backend && pnpm develop  # Strapi admin + API: http://localhost:1337
```

**Monorepo**: Uses `pnpm` workspaces with shared dependencies and separate `package.json` files
- Root workspace config in `elemental/pnpm-workspace.yaml` and `backend/pnpm-workspace.yaml`
- Each app maintains independent dependencies

## Critical Patterns

### Strapi v5 Data Handling
- **documentId**: New required field in v5 - use alongside `id` in interfaces
- **Relations**: Always structure as `{ data: { id, attributes } }` in API responses
- **Content Types**: Defined in `backend/src/api/*/content-types/*/schema.json`

### Authentication Flow
- **Token Storage**: JWT tokens stored in `js-cookie` as `'auth-token'`
- **Auto-Refresh**: Axios interceptors in `elemental/lib/api.ts` handle token injection and 401 redirects
- **Context**: `AuthContext.tsx` provides `useAuth()` hook with login/logout/registration
- **Protection**: Wrap pages with `<ProtectedRoute>` component for auth-required routes

### API Communication
```typescript
// Always use the configured api instance, never raw axios
import api from '@/lib/api';  // Pre-configured with baseURL and interceptors
const response = await api.get('/apartments?populate=*');
```

### Error Handling Patterns
- **Hooks**: Custom hooks include specific error handling (e.g., 403 permission errors)
- **API Interceptors**: Auto-redirect on 401, token cleanup in `elemental/lib/api.ts`
- **User Feedback**: Permission errors suggest Strapi configuration fixes

### TypeScript Interfaces
- **Base vs Full**: Separate interfaces for simple lists vs populated relations
  - `ApartmentBase` (listings) vs `Apartment` (with payments relation)
  - `PaymentSimplified` (frontend) vs `Payment` (full Strapi structure)

## Component Patterns

- **Data Fetching**: Custom hooks in `hooks/` (e.g., `useApartments`, `usePayments`)
- **Charts**: React Chart.js 2 with `chart.js` and `chartjs-plugin-annotation`
- **Icons**: Lucide React for consistent iconography
- **Styling**: Tailwind CSS with dark mode support
- **Layout**: Global AuthProvider and MainNavigation in root layout
- **Images**: Next.js Image component with configured domains (placeholder, unsplash, picsum)

## Key Files to Reference

- [`elemental/lib/api.ts`](elemental/lib/api.ts) - API client configuration
- [`elemental/context/AuthContext.tsx`](elemental/context/AuthContext.tsx) - Authentication state management
- [`elemental/types/`](elemental/types/) - TypeScript interfaces for domain models
- [`backend/config/database.ts`](backend/config/database.ts) - Database configuration
- [`elemental/components/ProtectedRoute.tsx`](elemental/components/ProtectedRoute.tsx) - Route protection pattern

## Testing

- **Frontend**: Jest + React Testing Library (config in `jest.config.js`, setup in `jest.setup.js`)  
- **Backend**: Basic Jest setup for services (see `payment.test.ts` example)
- Run tests: `npx jest` (no explicit test scripts in package.json files)

## Common Tasks

**New Strapi Content Type**: Create schema in `backend/src/api/[name]/content-types/[name]/schema.json`, restart backend
**Add API Route**: Use Strapi factories in controllers/services, or custom logic as needed
**Protected Frontend Route**: Wrap page content with `<ProtectedRoute>` component
**New Frontend Page**: Create in `elemental/app/` following App Router conventions