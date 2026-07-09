-- Secure read-only share links for companies
CREATE TABLE company_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  viewer_name TEXT NOT NULL,
  viewer_email TEXT NOT NULL,
  access_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_company_shares_company_id ON company_shares(company_id);
CREATE INDEX idx_company_shares_access_token ON company_shares(access_token);

ALTER TABLE company_shares ENABLE ROW LEVEL SECURITY;
CREATE POLICY company_shares_all ON company_shares FOR ALL USING (true) WITH CHECK (true);
