# Data Model: Supabase Authentication Refactor

**Feature**: 008-supabase-auth-refactor
**Date**: 2026-02-15

## Overview

This feature uses the **existing** Supabase database schema. No schema changes are required. This document maps the existing tables to the TypeScript types that the auth service will use.

## Existing Database Entities (Read-Only Reference)

### profiles

| Column           | Type        | Nullable | Default           | Used in Auth               |
| ---------------- | ----------- | -------- | ----------------- | -------------------------- |
| id               | uuid        | NO       | gen_random_uuid() | -                          |
| user_id          | uuid        | NO       | —                 | FK to auth.users           |
| first_name       | text        | YES      | —                 | Registration               |
| last_name        | text        | YES      | —                 | Registration               |
| display_name     | text        | NO       | —                 | Registration (computed)    |
| email            | text        | YES      | —                 | Registration               |
| country          | text        | YES      | —                 | Registration               |
| date_of_birth    | date        | YES      | —                 | Registration               |
| timezone         | text        | YES      | 'UTC'             | Registration (auto-detect) |
| avatar_url       | text        | YES      | —                 | -                          |
| is_guest         | boolean     | YES      | false             | Registration (set false)   |
| guest_created_at | timestamptz | YES      | —                 | -                          |
| created_at       | timestamptz | NO       | now()             | -                          |
| updated_at       | timestamptz | NO       | now()             | -                          |

**Constraints**: UNIQUE(user_id), UNIQUE(email)
**Trigger**: `on_profile_created` → auto-creates `user_streaks` row

### user_roles

| Column     | Type        | Nullable | Default           | Used in Auth              |
| ---------- | ----------- | -------- | ----------------- | ------------------------- |
| id         | uuid        | NO       | gen_random_uuid() | -                         |
| user_id    | uuid        | NO       | —                 | FK to auth.users          |
| role       | app_role    | NO       | —                 | Registration (set 'user') |
| created_at | timestamptz | NO       | now()             | -                         |

**Constraints**: UNIQUE(user_id, role)

### user_streaks

Auto-created by trigger when profile is inserted. **Never insert manually.**

| Column         | Type    | Nullable | Default |
| -------------- | ------- | -------- | ------- |
| user_id        | uuid    | NO       | —       |
| current_streak | integer | NO       | 0       |
| longest_streak | integer | NO       | 0       |
| total_points   | integer | NO       | 0       |

## TypeScript Type Definitions

### Auth Service Types (`authService.types.ts`)

```typescript
import type { Session, User } from '@supabase/supabase-js';

// ---- Registration ----

export interface RegisterParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  country: string;
  dateOfBirth: string; // ISO date string: "YYYY-MM-DD"
}

export interface RegisterResponse {
  success: boolean;
  user_id: string;
  message: string;
}

// ---- Login ----

export interface LoginParams {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  session: Session;
}

// ---- Profile ----

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string;
  email: string | null;
  country: string | null;
  date_of_birth: string | null;
  timezone: string | null;
  avatar_url: string | null;
  is_guest: boolean;
  created_at: string;
  updated_at: string;
}

// ---- Auth Context ----

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
```

### Validation Schema Types (existing, unchanged)

```typescript
// login.schema.ts
interface LoginFormData {
  email: string;
  password: string;
}

// signup.schema.ts
interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  dateOfBirth: Date;
}
```

## Data Flow

### Registration Flow

```
SignupForm → useSignupForm (hook)
  → useRegisterMutation (React Query useMutation)
    → authService.register(params)
      → supabase.functions.invoke('register-user', { body: ... })
        → Edge Function creates: auth user + profile + user_streaks (trigger) + user_role
      → supabase.auth.signInWithPassword(email, password) [auto-login after registration]
        → Session created and persisted to MMKV
        → onAuthStateChange fires SIGNED_IN
          → AuthProvider updates context
            → Root layout redirects to (main)
```

### Login Flow

```
LoginForm → useLoginForm (hook)
  → useLoginMutation (React Query useMutation)
    → authService.login(params)
      → supabase.auth.signInWithPassword({ email, password })
        → Session created and persisted to MMKV
        → onAuthStateChange fires SIGNED_IN
          → AuthProvider updates context
            → Root layout redirects to (main)
```

### Session Restoration Flow (App Launch)

```
App launches → AuthProvider mounts
  → supabase.auth.getSession() [reads from MMKV]
    → If session exists: set user + session, isLoading = false
    → If no session: set user = null, isLoading = false
  → supabase.auth.onAuthStateChange(callback) [subscribes]
    → SIGNED_IN: update user + session
    → SIGNED_OUT: clear user + session
    → TOKEN_REFRESHED: update session
```

### Logout Flow

```
User taps logout → useLogout (hook)
  → useLogoutMutation (React Query useMutation)
    → authService.logout()
      → supabase.auth.signOut()
        → MMKV session cleared
        → onAuthStateChange fires SIGNED_OUT
          → AuthProvider updates context (user = null)
            → Root layout redirects to (auth)
    → queryClient.clear() [clear all cached queries]
```

### Profile Fetch Flow

```
AuthProvider sets user (after login/restore)
  → useProfile hook (React Query useQuery)
    → enabled: !!user?.id
    → queryKey: ['profile', user.id]
    → queryFn: authService.getProfile(user.id)
      → supabase.from('profiles').select('*').eq('user_id', userId).single()
    → Returns: UserProfile
```

## State Transitions

### Auth State Machine

```
LOADING → AUTHENTICATED (session found or login success)
LOADING → UNAUTHENTICATED (no session)
AUTHENTICATED → UNAUTHENTICATED (logout or session expired)
UNAUTHENTICATED → AUTHENTICATED (login or register success)
```

## React Query Keys

| Key                   | Type  | Description                               |
| --------------------- | ----- | ----------------------------------------- |
| `['profile', userId]` | Query | User profile data. Invalidated on logout. |

## React Query Mutations

| Key        | Type     | Description                           |
| ---------- | -------- | ------------------------------------- |
| `login`    | Mutation | `authService.login(params)` → Session |
| `register` | Mutation | `authService.register(params)` → void |
| `logout`   | Mutation | `authService.logout()` → void         |
