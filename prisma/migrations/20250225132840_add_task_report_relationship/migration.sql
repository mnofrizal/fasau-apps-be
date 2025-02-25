/*
  Warnings:

  - A unique constraint covering the columns `[taskReportId]` on the table `tasks` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "TaskCategory" ADD VALUE 'TEMUAN';

-- AlterTable
ALTER TABLE "task_reports" ADD COLUMN     "isEscalated" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "taskReportId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "tasks_taskReportId_key" ON "tasks"("taskReportId");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_taskReportId_fkey" FOREIGN KEY ("taskReportId") REFERENCES "task_reports"("id") ON DELETE SET NULL ON UPDATE CASCADE;
