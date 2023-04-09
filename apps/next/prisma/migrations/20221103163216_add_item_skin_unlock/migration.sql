/*
  Warnings:

  - You are about to drop the `ItemSkinUnlock` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ItemSkinUnlock" DROP CONSTRAINT "ItemSkinUnlock_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ItemSkinUnlock" DROP CONSTRAINT "ItemSkinUnlock_skinId_fkey";

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "unlocksSkinIds" INTEGER[];

-- DropTable
DROP TABLE "ItemSkinUnlock";

-- CreateTable
CREATE TABLE "_ItemToSkin" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ItemToSkin_AB_unique" ON "_ItemToSkin"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemToSkin_B_index" ON "_ItemToSkin"("B");

-- AddForeignKey
ALTER TABLE "_ItemToSkin" ADD CONSTRAINT "_ItemToSkin_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToSkin" ADD CONSTRAINT "_ItemToSkin_B_fkey" FOREIGN KEY ("B") REFERENCES "Skin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
