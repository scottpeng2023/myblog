# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **full-stack blog platform** with a decoupled frontend and backend architecture:

- **Frontend**: Next.js 16.1.1 with App Router (React 19.2.3, TypeScript)
- **Backend**: FastAPI (Python) with SQLAlchemy ORM
- **Database**: MySQL
- **Authentication**: JWT-based with role-based access control (user/author/admin)

## Development Commands

### Frontend (Next.js)

```bash
# Install dependencies
pnpm install

# Start development server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

### Backend (FastAPI)

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Start development server (http://localhost:8000)
python main.py
# or: uvicorn main:app --reload

# Database migrations
alembic revision --autogenerate -m "description"
alembic upgrade head
alembic downgrade -1

# Run tests
pytest
```

## Architecture Overview

The project uses a **separated frontend/backend architecture**:

1. **Frontend** (Next.js) runs on port 3000, consumes REST APIs
2. **Backend** (FastAPI) runs on port 8000, serves API endpoints at `/api/v1`
3. **API client** (`lib/api/client.ts`) handles authentication tokens and HTTP requests
4. **State management**: Zustand for auth, TanStack Query for server data

### Key Architectural Patterns

- **Route Groups**: Next.js route groups `(auth)`, `(blog)`, `(admin)` organize pages by domain
- **API Client Singleton**: `apiClient` in `lib/api/client.ts` manages JWT tokens centrally
- **Auth Store**: Zustand store with persistence handles authentication state across the app
- **Query Provider**: TanStack Query wraps the app for data fetching and caching

### Frontend Directory Structure

```
app/
├── (auth)/          # Authentication routes (login, register)
├── (blog)/          # Public blog pages (posts, categories, tags)
├── (admin)/         # Admin dashboard and management
├── layout.tsx       # Root layout with QueryProvider
└── page.tsx         # Homepage

lib/
├── api/             # API client and HTTP layer
├── hooks/           # Custom React hooks (useAuth, etc.)
├── providers/       # React context providers
├── stores/          # Zustand state management
├── types/           # TypeScript type definitions
└── utils/           # Utility functions

components/
├── layout/          # Header, Footer, navigation
├── common/          # Reusable UI components
├── blog/            # Blog-specific components
└── admin/           # Admin dashboard components
```

### Backend Directory Structure

```
backend/
├── app/
│   ├── api/v1/      # API route handlers (auth, posts, comments, etc.)
│   ├── core/        # Configuration, database, security, dependencies
│   ├── models/      # SQLAlchemy ORM models
│   ├── schemas/     # Pydantic validation schemas
│   └── services/    # Business logic layer
├── alembic/         # Database migration files
└── main.py          # Application entry point
```

## Data Models

### Core Models (Backend)
- **User**: id, username, email, role (user/author/admin), avatar_url
- **Post**: id, title, slug, content, status (draft/published), author_id, cover_image
- **Category**: id, name, slug, description
- **Tag**: id, name, slug
- **Comment**: id, post_id, user_id, content, parent_id (for nested replies)
- **Media**: id, filename, filepath, mimetype, size, user_id

### TypeScript Types (Frontend)
All types are defined in `lib/types/index.ts` and match backend schemas:
- `User`, `Post`, `Category`, `Tag`, `Comment`, `Media`
- `PaginatedResponse<T>` for paginated list responses
- `ApiError` for error handling

## Configuration

### Environment Variables

**Backend** (`backend/.env`):
```
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/myblog
SECRET_KEY=your-secret-key
CORS_ORIGINS=["http://localhost:3000"]
```

**Frontend** (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Backend Settings (`backend/app/core/config.py`)
- JWT token expiration: 30 minutes (access), 7 days (refresh)
- File upload: 10MB max, allowed extensions [jpg, jpeg, png, gif, webp]
- OAuth placeholders: Google, GitHub (configured but not implemented)

## API Integration

The frontend uses a custom API client (`lib/api/client.ts`) that:
- Stores access/refresh tokens in localStorage
- Automatically includes Authorization header
- Handles token refresh logic
- Provides `get`, `post`, `put`, `delete`, `upload` methods

API base URL defaults to `http://localhost:8000/api/v1` and can be overridden via `NEXT_PUBLIC_API_URL`.

## State Management

- **Auth State**: `lib/stores/auth.ts` - Zustand store with persistence
  - Manages user, isAuthenticated, isLoading
  - Handles login, register, logout, checkAuth actions
  - Persisted to localStorage with key 'auth-storage'

- **Server State**: TanStack Query via `QueryProvider`
  - 60-second stale time
  - Window focus refetch disabled

## Authentication Flow

1. User submits login/register form
2. `apiClient.post()` sends credentials to `/auth/login` or `/auth/register`
3. Backend returns JWT tokens (access + refresh) and user object
4. `apiClient.setTokens()` stores tokens in localStorage
5. Auth store updates with user data and sets isAuthenticated to true
6. Protected routes check auth state before rendering
7. All API requests include Authorization header

## Role-Based Access

Three user roles with escalating permissions:
- **user**: Can read posts, create comments
- **author**: Can create/edit own posts, manage media
- **admin**: Full access to all resources

Backend uses `get_current_user()` dependency to inject authenticated user and check permissions.

## Database Setup

```sql
CREATE DATABASE myblog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Then run migrations: `alembic upgrade head`

## Performance Considerations

Recommended database indexes (see SETUP.md):
```sql
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_author_status ON posts(author_id, status);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_categories_slug ON categories(slug);
```

## API Documentation

Interactive API docs available at: `http://localhost:8000/api/v1/docs` (Swagger UI)

## Current Implementation Status

**Fully Implemented:**
- User authentication with JWT
- Backend CRUD operations for all models
- Frontend route structure and navigation
- Auth store with Zustand
- API client with token management
- TanStack Query integration
- Database migrations with Alembic

**Partially Implemented (uses mock data):**
- Blog post listing and detail pages
- Admin dashboard
- Media management UI
- Comment system UI

**Not Yet Implemented:**
- Post creation/editing UI
- Search functionality
- OAuth integration (Google/GitHub)
- Email verification
- SSG/ISR optimization
