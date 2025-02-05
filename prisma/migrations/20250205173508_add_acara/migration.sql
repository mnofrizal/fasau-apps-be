/*
  Warnings:

  - The `category` column on the `tasks` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TaskCategory" AS ENUM ('MEMO', 'TASK', 'LAPORAN');

-- CreateEnum
CREATE TYPE "AcaraStatus" AS ENUM ('UPCOMING', 'DONE', 'CANCEL');

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "category",
ADD COLUMN     "category" "TaskCategory" NOT NULL DEFAULT 'TASK';

-- CreateTable
CREATE TABLE "acara" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "status" "AcaraStatus" NOT NULL DEFAULT 'UPCOMING',
    "description" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "acara_pkey" PRIMARY KEY ("id")
);
