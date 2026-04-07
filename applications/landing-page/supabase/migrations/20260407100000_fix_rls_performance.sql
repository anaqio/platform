-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: fix_rls_performance
-- Created:   2026-04-07
-- Purpose:   Fix Auth RLS InitPlan warnings by wrapping auth.uid(), auth.jwt(),
--            and current_setting() calls in (SELECT ...) so Postgres evaluates
--            them once per query instead of once per row.
--            Also consolidates duplicate SELECT policies on generations into
--            a single USING clause with OR to avoid multiple-permissive-policy
--            overhead.
-- Advisors:  auth_rls_initplan × 4, multiple_permissive_policies × 4
-- Ref:       https://supabase.com/docs/guides/database/postgres/row-level-security
--            #call-functions-with-select
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── waitlist ────────────────────────────────────────────────────────────────
-- user_read_own: auth.jwt() called per-row → wrap in SELECT

DROP POLICY IF EXISTS "user_read_own" ON public.waitlist;

CREATE POLICY "user_read_own"
  ON public.waitlist
  FOR SELECT
  TO authenticated
  USING (email = ((SELECT auth.jwt()) ->> 'email'));

-- ─── profiles ────────────────────────────────────────────────────────────────
-- Both policies call auth.uid() per-row → wrap in SELECT

DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;

CREATE POLICY "Users read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- ─── generations ─────────────────────────────────────────────────────────────
-- Drop both overlapping SELECT policies (causes multiple-permissive-policy warn)
-- then recreate as a single combined policy with OR.
-- auth.uid() and current_setting() both wrapped in SELECT.

DROP POLICY IF EXISTS "Users read own generations" ON public.generations;
DROP POLICY IF EXISTS "Anon read own session generations" ON public.generations;

CREATE POLICY "read_own_generation"
  ON public.generations
  FOR SELECT
  USING (
    (SELECT auth.uid()) = user_id
    OR session_id = (
      SELECT (current_setting('request.headers', true))::json ->> 'x-session-id'
    )
  );
