-- Enable Supabase Realtime for live TV mode updates on task completion.
ALTER TABLE work_items REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'work_items'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE work_items;
  END IF;
END $$;
