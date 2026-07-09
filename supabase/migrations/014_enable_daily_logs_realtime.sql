-- Also stream daily log inserts for TV win detection fallback.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'daily_logs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE daily_logs;
  END IF;
END $$;
