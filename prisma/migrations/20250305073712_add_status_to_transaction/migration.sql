-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('DELIVERING', 'DELIVERED');

-- AlterTable
ALTER TABLE "inventory_transactions" ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT 'DELIVERING',
ADD COLUMN     "to" TEXT;
