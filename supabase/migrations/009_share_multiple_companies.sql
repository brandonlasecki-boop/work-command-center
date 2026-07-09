-- Allow one share invite to include multiple companies
CREATE TABLE company_share_companies (
  share_id UUID NOT NULL REFERENCES company_shares(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (share_id, company_id)
);

CREATE INDEX idx_company_share_companies_company_id ON company_share_companies(company_id);

INSERT INTO company_share_companies (share_id, company_id)
SELECT id, company_id FROM company_shares;

ALTER TABLE company_shares DROP COLUMN company_id;

ALTER TABLE company_share_companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY company_share_companies_all ON company_share_companies FOR ALL USING (true) WITH CHECK (true);
