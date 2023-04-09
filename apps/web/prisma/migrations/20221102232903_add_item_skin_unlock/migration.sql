-- DropForeignKey
ALTER TABLE "ItemSkinUnlock" DROP CONSTRAINT "ItemSkinUnlock_skinId_fkey";

-- AddForeignKey
ALTER TABLE "ItemSkinUnlock" ADD CONSTRAINT "ItemSkinUnlock_skinId_fkey" FOREIGN KEY ("skinId") REFERENCES "Skin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
