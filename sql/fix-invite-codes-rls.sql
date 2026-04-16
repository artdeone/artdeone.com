-- =====================================================
-- ART de ONE — Fix invite_codes RLS Policies
-- Run this in the Supabase SQL Editor
-- =====================================================

-- 1. Enable RLS on invite_codes (safe if already enabled)
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;

-- 2. Admin can SELECT all invite codes
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'invite_codes' AND policyname = 'Admin can view all invite codes') THEN
    CREATE POLICY "Admin can view all invite codes"
      ON invite_codes FOR SELECT
      USING (auth.jwt() ->> 'email' = 'artdeone.educators@gmail.com');
  END IF;
END $$;

-- 3. Admin can INSERT invite codes
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'invite_codes' AND policyname = 'Admin can insert invite codes') THEN
    CREATE POLICY "Admin can insert invite codes"
      ON invite_codes FOR INSERT
      WITH CHECK (auth.jwt() ->> 'email' = 'artdeone.educators@gmail.com');
  END IF;
END $$;

-- 4. Admin can UPDATE invite codes
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'invite_codes' AND policyname = 'Admin can update invite codes') THEN
    CREATE POLICY "Admin can update invite codes"
      ON invite_codes FOR UPDATE
      USING (auth.jwt() ->> 'email' = 'artdeone.educators@gmail.com')
      WITH CHECK (auth.jwt() ->> 'email' = 'artdeone.educators@gmail.com');
  END IF;
END $$;

-- 5. Admin can DELETE invite codes
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'invite_codes' AND policyname = 'Admin can delete invite codes') THEN
    CREATE POLICY "Admin can delete invite codes"
      ON invite_codes FOR DELETE
      USING (auth.jwt() ->> 'email' = 'artdeone.educators@gmail.com');
  END IF;
END $$;
