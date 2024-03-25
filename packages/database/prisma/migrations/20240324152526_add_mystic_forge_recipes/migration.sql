/*
  Warnings:

  - Made the column `outputItemId` on table `MysticForgeRecipe` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "MysticForgeRecipe" DROP CONSTRAINT "MysticForgeRecipe_outputItemId_fkey";

-- AlterTable
ALTER TABLE "MysticForgeRecipe" ALTER COLUMN "outputItemId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "MysticForgeRecipe" ADD CONSTRAINT "MysticForgeRecipe_outputItemId_fkey" FOREIGN KEY ("outputItemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
