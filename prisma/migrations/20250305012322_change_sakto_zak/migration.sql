/*
  Warnings:

  - The values [sak] on the enum `ItemUnit` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ItemUnit_new" AS ENUM ('pcs', 'box', 'kg', 'meter', 'roll', 'liter', 'pack', 'set', 'buah', 'unit', 'lembar', 'pal', 'galon', 'biji', 'kaleng', 'zak', 'karung', 'm3');
ALTER TABLE "inventory_items" ALTER COLUMN "unit" TYPE "ItemUnit_new" USING ("unit"::text::"ItemUnit_new");
ALTER TYPE "ItemUnit" RENAME TO "ItemUnit_old";
ALTER TYPE "ItemUnit_new" RENAME TO "ItemUnit";
DROP TYPE "ItemUnit_old";
COMMIT;
