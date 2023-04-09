-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_outputItemId_fkey";

-- AlterTable
ALTER TABLE "Recipe" ALTER COLUMN "outputItemId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_outputItemId_fkey" FOREIGN KEY ("outputItemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
