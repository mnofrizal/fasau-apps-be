-- CreateEnum
CREATE TYPE "ReportSubCategory" AS ENUM ('LAPORAN', 'TEMUAN');

-- AlterTable
ALTER TABLE "task_reports" ADD COLUMN     "subCategory" "ReportSubCategory";
