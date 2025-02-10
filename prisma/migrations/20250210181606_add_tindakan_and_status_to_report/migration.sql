-- AlterEnum
ALTER TYPE "TaskStatus" ADD VALUE 'BACKLOG';

-- AlterTable
ALTER TABLE "task_reports" ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'INPROGRESS',
ADD COLUMN     "tindakan" TEXT,
ALTER COLUMN "subCategory" DROP NOT NULL,
ALTER COLUMN "subCategory" DROP DEFAULT;
