-- CreateEnum
CREATE TYPE "ItemUnit" AS ENUM ('pcs', 'box', 'kg', 'meter', 'roll', 'liter', 'pack', 'set', 'buah', 'unit', 'lembar', 'pal', 'galon', 'biji');

-- AlterTable
ALTER TABLE "inventory_items" ADD COLUMN     "unit" "ItemUnit";
