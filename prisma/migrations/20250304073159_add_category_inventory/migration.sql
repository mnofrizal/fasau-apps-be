-- CreateEnum
CREATE TYPE "InventoryCategory" AS ENUM ('CHAIR', 'TABLE', 'COMPUTER', 'PRINTER', 'NETWORK', 'STORAGE', 'ELECTRONIC', 'FURNITURE', 'OTHER');

-- AlterTable
ALTER TABLE "inventory_items" ADD COLUMN     "brand" TEXT,
ADD COLUMN     "category" "InventoryCategory" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "itemType" TEXT;
