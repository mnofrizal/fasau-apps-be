-- First update existing NULL values to 'LAPORAN'
UPDATE "task_reports" SET "subCategory" = 'LAPORAN' WHERE "subCategory" IS NULL;

-- Then make the column required with default
ALTER TABLE "task_reports" ALTER COLUMN "subCategory" SET NOT NULL,
ALTER COLUMN "subCategory" SET DEFAULT 'LAPORAN';
