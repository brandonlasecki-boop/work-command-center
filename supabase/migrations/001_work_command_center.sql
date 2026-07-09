-- Work Command Center — initial schema

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE project_status AS ENUM (
  'not_started',
  'in_progress',
  'completed',
  'blocked',
  'paused'
);

CREATE TYPE project_priority AS ENUM (
  'low',
  'medium',
  'high',
  'urgent'
);

CREATE TYPE work_item_type AS ENUM (
  'phase',
  'subphase',
  'task'
);

CREATE TYPE work_item_status AS ENUM (
  'not_started',
  'in_progress',
  'completed',
  'blocked'
);

-- Tables
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6366f1',
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status project_status NOT NULL DEFAULT 'not_started',
  priority project_priority NOT NULL DEFAULT 'medium',
  start_date DATE,
  due_date DATE,
  manual_progress_override NUMERIC(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE work_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES work_items(id) ON DELETE CASCADE,
  type work_item_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status work_item_status NOT NULL DEFAULT 'not_started',
  sort_order INT NOT NULL DEFAULT 0,
  weight NUMERIC NOT NULL DEFAULT 1,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  work_item_id UUID REFERENCES work_items(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_projects_company_id ON projects(company_id);
CREATE INDEX idx_work_items_project_id ON work_items(project_id);
CREATE INDEX idx_work_items_parent_id ON work_items(parent_id);
CREATE INDEX idx_work_items_project_parent_sort ON work_items(project_id, parent_id, sort_order);
CREATE INDEX idx_daily_logs_log_date ON daily_logs(log_date);
CREATE INDEX idx_daily_logs_company_id ON daily_logs(company_id);
CREATE INDEX idx_daily_logs_project_id ON daily_logs(project_id);
CREATE UNIQUE INDEX idx_daily_logs_work_item_date ON daily_logs(work_item_id, log_date) WHERE work_item_id IS NOT NULL;

-- updated_at trigger function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER work_items_updated_at
  BEFORE UPDATE ON work_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Completion trigger: auto daily log + completed_at
CREATE OR REPLACE FUNCTION handle_work_item_completion()
RETURNS TRIGGER AS $$
DECLARE
  v_company_id UUID;
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS DISTINCT FROM 'completed') THEN
    IF NEW.completed_at IS NULL THEN
      NEW.completed_at = now();
    END IF;

    SELECT p.company_id INTO v_company_id
    FROM projects p
    WHERE p.id = NEW.project_id;

    INSERT INTO daily_logs (company_id, project_id, work_item_id, title, description, log_date)
    SELECT v_company_id, NEW.project_id, NEW.id, NEW.title, NEW.description, CURRENT_DATE
    WHERE NOT EXISTS (
      SELECT 1 FROM daily_logs dl
      WHERE dl.work_item_id = NEW.id AND dl.log_date = CURRENT_DATE
    );
  END IF;

  IF NEW.status != 'completed' AND OLD.status = 'completed' THEN
    NEW.completed_at = NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER work_items_completion
  BEFORE UPDATE ON work_items
  FOR EACH ROW EXECUTE FUNCTION handle_work_item_completion();

-- RLS (permissive for personal MVP)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY companies_all ON companies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY projects_all ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY work_items_all ON work_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY daily_logs_all ON daily_logs FOR ALL USING (true) WITH CHECK (true);
