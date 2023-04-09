/*
  Warnings:

  - You are about to drop the `_ItemToSkin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ItemToSkin" DROP CONSTRAINT "_ItemToSkin_A_fkey";

-- DropForeignKey
ALTER TABLE "_ItemToSkin" DROP CONSTRAINT "_ItemToSkin_B_fkey";

-- DropTable
DROP TABLE "_ItemToSkin";

-- CreateTable
CREATE TABLE "ItemSkinUnlock" (
    "itemId" INTEGER NOT NULL,
    "skinId" INTEGER NOT NULL,

    CONSTRAINT "ItemSkinUnlock_pkey" PRIMARY KEY ("itemId","skinId")
);

-- AddForeignKey
ALTER TABLE "ItemSkinUnlock" ADD CONSTRAINT "ItemSkinUnlock_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemSkinUnlock" ADD CONSTRAINT "ItemSkinUnlock_skinId_fkey" FOREIGN KEY ("skinId") REFERENCES "Skin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
