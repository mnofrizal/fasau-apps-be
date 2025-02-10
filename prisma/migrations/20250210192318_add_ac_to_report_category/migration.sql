/*
  Warnings:

  - The values [MK,TIJ,TDP,JSI,PMT,PST] on the enum `ReportCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReportCategory_new" AS ENUM ('CM', 'PM', 'AC');
ALTER TABLE "task_reports" ALTER COLUMN "category" TYPE "ReportCategory_new" USING ("category"::text::"ReportCategory_new");
ALTER TYPE "ReportCategory" RENAME TO "ReportCategory_old";
ALTER TYPE "ReportCategory_new" RENAME TO "ReportCategory";
DROP TYPE "ReportCategory_old";
COMMIT;
