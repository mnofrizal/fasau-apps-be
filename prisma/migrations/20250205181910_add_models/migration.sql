-- CreateEnum
CREATE TYPE "ReportCategory" AS ENUM ('CM', 'PM');

-- CreateTable
CREATE TABLE "task_reports" (
    "id" SERIAL NOT NULL,
    "evidence" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pelapor" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "category" "ReportCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_reports_pkey" PRIMARY KEY ("id")
);
