-- =====================================================
-- ART de ONE — Fix announcements RLS Policies
-- Run this in the Supabase SQL Editor
-- =====================================================

-- 1. Enable RLS on announcements table
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- 2. Admin can do everything with announcements
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'announcements' AND policyname = 'Admin full access to announcements') THEN
    CREATE POLICY "Admin full access to announcements"
      ON announcements FOR ALL
      USING (auth.jwt() ->> 'email' = 'artdeone.educators@gmail.com')
      WITH CHECK (auth.jwt() ->> 'email' = 'artdeone.educators@gmail.com');
  END IF;
END $$;

-- 3. Students can SELECT announcements (filtered client-side by target_audience, batch_id, level)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'announcements' AND policyname = 'Students can view active announcements') THEN
    CREATE POLICY "Students can view active announcements"
      ON announcements FOR SELECT
      USING (is_active = true);
  END IF;
END $$;
