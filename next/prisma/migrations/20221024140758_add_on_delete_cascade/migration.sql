-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_currentId_de_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_currentId_en_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_currentId_es_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_currentId_fr_fkey";

-- DropForeignKey
ALTER TABLE "ItemHistory" DROP CONSTRAINT "ItemHistory_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ItemHistory" DROP CONSTRAINT "ItemHistory_revisionId_fkey";

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_currentId_de_fkey" FOREIGN KEY ("currentId_de") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_currentId_en_fkey" FOREIGN KEY ("currentId_en") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_currentId_es_fkey" FOREIGN KEY ("currentId_es") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_currentId_fr_fkey" FOREIGN KEY ("currentId_fr") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemHistory" ADD CONSTRAINT "ItemHistory_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemHistory" ADD CONSTRAINT "ItemHistory_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
