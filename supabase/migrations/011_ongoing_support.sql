-- Ongoing support flag for companies + support log type on daily_logs

ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS is_ongoing_support BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE daily_logs
  ADD COLUMN IF NOT EXISTS log_type TEXT NOT NULL DEFAULT 'general'
  CHECK (log_type IN ('general', 'support'));

CREATE INDEX IF NOT EXISTS idx_daily_logs_company_support
  ON daily_logs (company_id, log_date DESC)
  WHERE log_type = 'support';

-- WoundCare 360 receives ongoing IT / device / email support
UPDATE companies
SET is_ongoing_support = true
WHERE name = 'WoundCare 360';
