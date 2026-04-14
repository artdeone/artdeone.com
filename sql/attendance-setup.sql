-- =====================================================
-- ART de ONE — Live Class Attendance Feature
-- Supabase SQL Setup
-- Run this in the Supabase SQL Editor
-- =====================================================

-- 1. Enable Realtime on the students table
ALTER PUBLICATION supabase_realtime ADD TABLE students;

-- 2. Add attendance columns (safe IF NOT EXISTS)
-- NOTE: student_id column already exists — do NOT recreate it
ALTER TABLE students ADD COLUMN IF NOT EXISTS total_attendance INTEGER DEFAULT 0;
ALTER TABLE students ADD COLUMN IF NOT EXISTS late_attendance INTEGER DEFAULT 0;
ALTER TABLE students ADD COLUMN IF NOT EXISTS undertime INTEGER DEFAULT 0;
ALTER TABLE students ADD COLUMN IF NOT EXISTS absent_days INTEGER DEFAULT 0;

-- 3. RLS Policies
-- Enable RLS if not already enabled
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Students can SELECT their own row (required for Realtime payload delivery)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'students' AND policyname = 'Students can view own row') THEN
    CREATE POLICY "Students can view own row"
      ON students FOR SELECT
      USING (auth.uid() = id);
  END IF;
END $$;

-- Students can UPDATE their own row
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'students' AND policyname = 'Students can update own row') THEN
    CREATE POLICY "Students can update own row"
      ON students FOR UPDATE
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Admin can SELECT all student rows
-- ⚠️ REPLACE 'admin@yourdomain.com' with your actual admin email
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'students' AND policyname = 'Admin can view all students') THEN
    CREATE POLICY "Admin can view all students"
      ON students FOR SELECT
      USING (auth.jwt() ->> 'email' = 'admin@yourdomain.com');  -- ← Replace with your admin email
  END IF;
END $$;

-- Admin can UPDATE all student rows
-- ⚠️ REPLACE 'admin@yourdomain.com' with your actual admin email
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'students' AND policyname = 'Admin can update all students') THEN
    CREATE POLICY "Admin can update all students"
      ON students FOR UPDATE
      USING (auth.jwt() ->> 'email' = 'admin@yourdomain.com')   -- ← Replace with your admin email
      WITH CHECK (auth.jwt() ->> 'email' = 'admin@yourdomain.com');
  END IF;
END $$;


-- 4. RPC — update_student_attendance_stats (Manual full override)
CREATE OR REPLACE FUNCTION update_student_attendance_stats(
  p_student_id UUID,
  p_total INT,
  p_late INT,
  p_undertime INT,
  p_absent INT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE students
  SET
    total_attendance = p_total,
    late_attendance = p_late,
    undertime = p_undertime,
    absent_days = p_absent
  WHERE id = p_student_id;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION update_student_attendance_stats(UUID, INT, INT, INT, INT) TO authenticated;


-- 5. RPC — increment_student_attendance (Auto-increment on student join)
CREATE OR REPLACE FUNCTION increment_student_attendance(
  p_student_id_code TEXT,
  p_is_late BOOLEAN DEFAULT FALSE
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_student_id UUID;
BEGIN
  -- Look up student by the existing student_id TEXT column (8-char hex code e.g. D7FED9FE)
  SELECT id INTO v_student_id
  FROM students
  WHERE student_id = p_student_id_code
  LIMIT 1;

  IF v_student_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Student not found with ID: ' || p_student_id_code);
  END IF;

  -- Increment total_attendance
  UPDATE students
  SET total_attendance = COALESCE(total_attendance, 0) + 1
  WHERE id = v_student_id;

  -- Increment late_attendance only if late
  IF p_is_late THEN
    UPDATE students
    SET late_attendance = COALESCE(late_attendance, 0) + 1
    WHERE id = v_student_id;
  END IF;

  -- Does NOT touch undertime or absent_days

  RETURN json_build_object('success', true);
END;
$$;

-- Grant execute to both anon and authenticated
-- (students may call this without being logged in via Supabase Auth)
GRANT EXECUTE ON FUNCTION increment_student_attendance(TEXT, BOOLEAN) TO anon;
GRANT EXECUTE ON FUNCTION increment_student_attendance(TEXT, BOOLEAN) TO authenticated;
