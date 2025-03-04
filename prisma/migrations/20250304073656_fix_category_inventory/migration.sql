/*
  Warnings:

  - You are about to drop the column `brand` on the `inventory_items` table. All the data in the column will be lost.
  - You are about to drop the column `itemType` on the `inventory_items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "inventory_items" DROP COLUMN "brand",
DROP COLUMN "itemType";
