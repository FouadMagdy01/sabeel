# Auth API Contract: Login

## Sign In

**Provider**: Supabase Auth (`supabase.auth.signInWithPassword`)

### Request

```typescript
{
  email: string; // RFC 5322 valid email
  password: string; // minimum 8 characters
}
```

### Success Response

```typescript
{
  data: {
    user: User; // Supabase User object
    session: Session; // Contains access_token, refresh_token
  }
  error: null;
}
```

### Error Responses

| Scenario            | `error.message`              | UI Display Key                    |
| ------------------- | ---------------------------- | --------------------------------- |
| Invalid credentials | "Invalid login credentials"  | `auth.login.invalidCredentials`   |
| Email not confirmed | "Email not confirmed"        | `auth.login.invalidCredentials`\* |
| Rate limited        | "Request rate limit reached" | `errors.generic`                  |
| Network failure     | (fetch throws)               | `errors.network`                  |
| Server error (5xx)  | varies                       | `errors.serverError`              |

\* Per security considerations, do not reveal whether email exists in system.

## Navigation Contract

| Action            | Target Route       | Method           |
| ----------------- | ------------------ | ---------------- |
| Login success     | `/(main)/(tabs)`   | `router.replace` |
| Continue as Guest | `/(main)/(tabs)`   | `router.replace` |
| Sign Up           | `/(auth)/Signup`   | `router.push`    |
| Forgot Password   | (placeholder/noop) | `router.push`\*  |

\* Forgot Password screen not yet implemented. Navigate to a placeholder or show a toast notification.
