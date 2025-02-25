-- CreateTable
CREATE TABLE "status_history" (
    "id" SERIAL NOT NULL,
    "status" "TaskStatus" NOT NULL,
    "notes" TEXT,
    "changedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "taskId" INTEGER NOT NULL,
    "reportId" INTEGER,

    CONSTRAINT "status_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "status_history" ADD CONSTRAINT "status_history_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_history" ADD CONSTRAINT "status_history_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "task_reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
