# Storage Reference

> ✅ **Verified** — All buckets and policies taken directly from the live database.

## Buckets

| Bucket ID            | Public | Notes                             |
| -------------------- | ------ | --------------------------------- |
| `avatars`            | ✅ Yes | User profile pictures             |
| `report-attachments` | ❌ No  | Files attached to support reports |

---

## Storage Policies (Exact from DB)

### `avatars` Bucket (Public)

Because the bucket is **public**, anyone can read files via URL without auth. The policies below control write operations.

| Policy                                | Operation | Rule                                                                           |
| ------------------------------------- | --------- | ------------------------------------------------------------------------------ |
| Avatar images are publicly accessible | SELECT    | `bucket_id = 'avatars'`                                                        |
| Users can upload own avatar           | INSERT    | `bucket_id = 'avatars'` AND `auth.uid()::text = (storage.foldername(name))[1]` |
| Users can update own avatar           | UPDATE    | `bucket_id = 'avatars'` AND `auth.uid()::text = (storage.foldername(name))[1]` |
| Users can delete own avatar           | DELETE    | `bucket_id = 'avatars'` AND `auth.uid()::text = (storage.foldername(name))[1]` |

**Exact SQL:**

```sql
-- Anyone can view (public bucket)
"Avatar images are publicly accessible"
USING (bucket_id = 'avatars'::text)

-- User can only upload/update/delete to their own folder
"Users can upload own avatar"
WITH CHECK ((bucket_id = 'avatars'::text) AND ((auth.uid())::text = (storage.foldername(name))[1]))

"Users can update own avatar"
USING ((bucket_id = 'avatars'::text) AND ((auth.uid())::text = (storage.foldername(name))[1]))

"Users can delete own avatar"
USING ((bucket_id = 'avatars'::text) AND ((auth.uid())::text = (storage.foldername(name))[1]))
```

---

### `report-attachments` Bucket (Private)

| Policy                                        | Operation | Rule                                                                       |
| --------------------------------------------- | --------- | -------------------------------------------------------------------------- |
| Users can upload report attachments           | INSERT    | `bucket_id = 'report-attachments'` AND `auth.uid()::text = foldername[1]`  |
| Users can view own report attachments storage | SELECT    | `bucket_id = 'report-attachments'` AND `auth.uid()::text = foldername[1]`  |
| Admins can view all report attachments        | SELECT    | `bucket_id = 'report-attachments'` AND `has_role(auth.uid(), 'admin')`     |
| Moderators can view all report attachments    | SELECT    | `bucket_id = 'report-attachments'` AND `has_role(auth.uid(), 'moderator')` |

**Exact SQL:**

```sql
"Users can upload report attachments"
WITH CHECK ((bucket_id = 'report-attachments'::text) AND ((auth.uid())::text = (storage.foldername(name))[1]))

"Users can view own report attachments storage"
USING ((bucket_id = 'report-attachments'::text) AND ((auth.uid())::text = (storage.foldername(name))[1]))

"Admins can view all report attachments"
USING ((bucket_id = 'report-attachments'::text) AND has_role(auth.uid(), 'admin'::app_role))

"Moderators can view all report attachments"
USING ((bucket_id = 'report-attachments'::text) AND has_role(auth.uid(), 'moderator'::app_role))
```

**⚠️ Gaps in report-attachments:**

- ❌ No UPDATE policy — users cannot replace attachments, only upload new ones
- ❌ No DELETE policy for users — users cannot delete their own attachments
- If you need these, add them following the pattern below

---

## File Path Convention

Both buckets use `{user_id}/...` as the first folder, which is how the storage policies verify ownership via `(storage.foldername(name))[1]`.

### `avatars`

```
avatars/
  {user_id}/avatar.png
  {user_id}/avatar.jpg
```

### `report-attachments`

```
report-attachments/
  {user_id}/{report_id}/{filename}
```

---

## Frontend Usage Examples

### Upload avatar

```typescript
const filePath = `${userId}/avatar.${fileExt}`;

const { data, error } = await supabase.storage.from('avatars').upload(filePath, file, {
  upsert: true, // Replace if exists
  contentType: file.type,
});

// Get public URL (bucket is public, no auth needed)
const {
  data: { publicUrl },
} = supabase.storage.from('avatars').getPublicUrl(filePath);

// Save to profiles table
await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('user_id', userId);
```

### Delete avatar

```typescript
const { error } = await supabase.storage.from('avatars').remove([`${userId}/avatar.png`]);
```

### Upload report attachment

```typescript
const filePath = `${userId}/${reportId}/${fileName}`;

const { data, error } = await supabase.storage
  .from('report-attachments')
  .upload(filePath, file, { contentType: file.type });

// Get signed URL (bucket is private — must use signed URL)
const { data: signedUrl } = await supabase.storage
  .from('report-attachments')
  .createSignedUrl(filePath, 3600); // 1 hour expiry

// Save to report_attachments table
await supabase.from('report_attachments').insert({
  report_id: reportId,
  file_url: filePath, // Store the path, generate signed URLs on demand
  file_name: fileName,
  file_type: file.type,
});
```

### Get signed URL for private file

```typescript
const { data } = await supabase.storage
  .from('report-attachments')
  .createSignedUrl(`${userId}/${reportId}/${fileName}`, 3600);

const url = data?.signedUrl;
```

---

## Adding a New Policy

Always DROP before CREATE to avoid "already exists" errors:

```sql
DROP POLICY IF EXISTS "policy_name" ON storage.objects;

CREATE POLICY "policy_name"
ON storage.objects FOR SELECT | INSERT | UPDATE | DELETE
USING / WITH CHECK (
  bucket_id = 'your-bucket-name'
  AND <condition>
);
```

### Common conditions:

```sql
-- Own folder (standard ownership check)
(auth.uid())::text = (storage.foldername(name))[1]

-- Admin access
has_role(auth.uid(), 'admin'::app_role)

-- Moderator access
has_role(auth.uid(), 'moderator'::app_role)

-- Public (no auth required)
true
```

---

## ⚠️ Important Notes for Claude Code

1. **`avatars` is public** — use `getPublicUrl()`, no signed URLs needed
2. **`report-attachments` is private** — always use `createSignedUrl()` for user-facing links, never `getPublicUrl()`
3. **Ownership is path-based** — first folder MUST be the user's UUID for policies to work
4. **No UPDATE/DELETE for report attachments** — these policies don't exist; if needed, add them
5. **Storage files don't auto-delete** when DB records are deleted — handle in application code or Edge Functions
6. **`has_role()` function works in storage policies** exactly the same as in table policies
7. **Always DROP POLICY IF EXISTS before recreating** to avoid conflicts
