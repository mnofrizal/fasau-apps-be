/*
  Warnings:

  - Made the column `subCategory` on table `task_reports` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "task_reports" ALTER COLUMN "subCategory" SET NOT NULL,
ALTER COLUMN "subCategory" SET DEFAULT 'LAPORAN';
