-- ═══════════════════════════════════════════════════════════════
-- Level System Migration (Idempotent)
-- Adds level column (beginner/intermediate/advanced) to:
--   1. students        — tracks student skill level
--   2. course_files    — organizes files by difficulty
--   3. announcements   — targets announcements by level
--   4. recorded_videos — filters videos by level
-- Run this migration in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ── 1. Students ──
ALTER TABLE students ADD COLUMN IF NOT EXISTS level TEXT DEFAULT NULL;

-- Drop constraint if exists (for re-runs), then add it
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'students_level_check'
    ) THEN
        ALTER TABLE students DROP CONSTRAINT students_level_check;
    END IF;
END $$;

ALTER TABLE students ADD CONSTRAINT students_level_check
CHECK (level IS NULL OR level IN ('beginner', 'intermediate', 'advanced'));

COMMENT ON COLUMN students.level IS 'Student skill level: beginner, intermediate, or advanced. Assigned by admin via Assign to Batch modal.';

-- ── 2. Course Files ──
ALTER TABLE course_files ADD COLUMN IF NOT EXISTS level TEXT DEFAULT NULL;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'course_files_level_check'
    ) THEN
        ALTER TABLE course_files DROP CONSTRAINT course_files_level_check;
    END IF;
END $$;

ALTER TABLE course_files ADD CONSTRAINT course_files_level_check
CHECK (level IS NULL OR level IN ('beginner', 'intermediate', 'advanced'));

COMMENT ON COLUMN course_files.level IS 'File difficulty level: beginner, intermediate, or advanced. Set by admin when uploading course files.';

-- ── 3. Announcements ──
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS level TEXT DEFAULT NULL;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'announcements_level_check'
    ) THEN
        ALTER TABLE announcements DROP CONSTRAINT announcements_level_check;
    END IF;
END $$;

ALTER TABLE announcements ADD CONSTRAINT announcements_level_check
CHECK (level IS NULL OR level IN ('beginner', 'intermediate', 'advanced'));

COMMENT ON COLUMN announcements.level IS 'Target level for announcement: beginner, intermediate, or advanced. NULL means all levels.';

-- ── 4. Recorded Videos ──
ALTER TABLE recorded_videos ADD COLUMN IF NOT EXISTS level TEXT DEFAULT NULL;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'recorded_videos_level_check'
    ) THEN
        ALTER TABLE recorded_videos DROP CONSTRAINT recorded_videos_level_check;
    END IF;
END $$;

ALTER TABLE recorded_videos ADD CONSTRAINT recorded_videos_level_check
CHECK (level IS NULL OR level IN ('beginner', 'intermediate', 'advanced'));

COMMENT ON COLUMN recorded_videos.level IS 'Video difficulty level: beginner, intermediate, or advanced. NULL means all levels. Students only see videos matching their level or with no level set.';
