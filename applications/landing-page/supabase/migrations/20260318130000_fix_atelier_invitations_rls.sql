-- Fix: drop the PUBLIC-scoped policy on atelier_invitations.
--
-- The service_role used by server actions has BYPASSRLS privilege and never
-- evaluates policies, so no policy is needed for it. With RLS enabled and no
-- permissive policy, anon and authenticated roles are denied by default, which
-- is the intended access model for this table.

DROP POLICY IF EXISTS "Service role manages atelier invitations" ON atelier_invitations;
