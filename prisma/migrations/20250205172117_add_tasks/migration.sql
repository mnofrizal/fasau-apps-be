-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('COMPLETED', 'CANCEL', 'INPROGRESS');

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'INPROGRESS',
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);
