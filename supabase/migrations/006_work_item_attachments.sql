-- Task attachments stored under company/project/work item in Supabase Storage
CREATE TABLE work_item_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  work_item_id UUID NOT NULL REFERENCES work_items(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  file_size BIGINT NOT NULL DEFAULT 0,
  mime_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_work_item_attachments_work_item_id ON work_item_attachments(work_item_id);
CREATE INDEX idx_work_item_attachments_project_id ON work_item_attachments(project_id);
CREATE INDEX idx_work_item_attachments_company_id ON work_item_attachments(company_id);

ALTER TABLE work_item_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY work_item_attachments_all ON work_item_attachments FOR ALL USING (true) WITH CHECK (true);

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('project-resources', 'project-resources', false, 52428800)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY project_resources_select ON storage.objects
  FOR SELECT USING (bucket_id = 'project-resources');

CREATE POLICY project_resources_insert ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'project-resources');

CREATE POLICY project_resources_update ON storage.objects
  FOR UPDATE USING (bucket_id = 'project-resources');

CREATE POLICY project_resources_delete ON storage.objects
  FOR DELETE USING (bucket_id = 'project-resources');
