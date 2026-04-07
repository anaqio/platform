-- Atelier invitation requests table
-- Collects high-intent early access leads via the Typeform-inspired form

CREATE TABLE IF NOT EXISTS atelier_invitations (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email          TEXT        NOT NULL,
  whatsapp       TEXT,
  entity_name    TEXT        NOT NULL,
  role           TEXT        NOT NULL,
  revenue_range  TEXT,
  referral_source TEXT,
  source         TEXT        NOT NULL DEFAULT 'early-access',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX atelier_invitations_email_idx ON atelier_invitations(email);

ALTER TABLE atelier_invitations ENABLE ROW LEVEL SECURITY;

-- Only the service role (server actions) may insert/read rows
CREATE POLICY "Service role manages atelier invitations"
  ON atelier_invitations
  USING (true)
  WITH CHECK (true);
