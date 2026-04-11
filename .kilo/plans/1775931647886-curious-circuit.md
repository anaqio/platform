# Plan: Fix /api/upload 500 Error

## Problem

The `/api/upload` endpoint returns 500 for all garment upload requests. The error occurs in `uploadGarment` function (`lib/utils/storage.ts:10`) which uses the admin Supabase client to upload to the `garments` storage bucket.

## Likely Causes

1. **Missing env var**: `SUPABASE_SERVICE_ROLE_KEY` not set in Vercel production
2. **Missing bucket**: `garments` storage bucket doesn't exist in Supabase
3. **RLS policy**: Storage bucket policies blocking service role access

## Investigation Steps

1. Check Vercel environment variables for `SUPABASE_SERVICE_ROLE_KEY`
2. Query Supabase to verify the `garments` bucket exists:
   ```sql
   SELECT * FROM storage.buckets WHERE id = 'garments';
   ```
3. Check storage bucket policies:
   ```sql
   SELECT * FROM storage.policy WHERE bucket_id = 'garments';
   ```

## Fixes

### If env var missing

- Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel project settings

### If bucket missing

Create the bucket via SQL:

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('garments', 'garments', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']);
```

### If RLS policies issue

The service role bypasses RLS, but if using anon key or user client would require policies. The code uses admin client with service role key, so RLS shouldn't block. However, verify:

```sql
-- Allow authenticated uploads
CREATE POLICY "Allow uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'garments');
```

Or simply allow public uploads (for this demo):

```sql
-- Allow anyone to upload to garments bucket
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'garments');
```

## Code Path Being Tested

```
POST /api/upload
  → route.ts:8-16 - Auth check (skipped if KIOSK_MODE=true)
  → route.ts:18-32 - Form data validation
  → storage.ts:10-23 - uploadGarment()
    → admin.storage.from('garments').upload()
```

## Execution Order

1. First, verify env var exists locally: `echo $SUPABASE_SERVICE_ROLE_KEY`
2. Check Supabase storage buckets exist
3. Fix whatever is missing
4. Test upload again
