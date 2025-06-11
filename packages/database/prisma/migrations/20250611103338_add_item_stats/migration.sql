-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "itemStatIds" INTEGER[];

-- CreateTable
CREATE TABLE "ItemStat" (
    "id" INTEGER NOT NULL,
    "name_de" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_es" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "removedFromApi" BOOLEAN NOT NULL DEFAULT false,
    "currentId_de" TEXT NOT NULL,
    "currentId_en" TEXT NOT NULL,
    "currentId_es" TEXT NOT NULL,
    "currentId_fr" TEXT NOT NULL,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ItemStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemStatHistory" (
    "itemStatId" INTEGER NOT NULL,
    "revisionId" TEXT NOT NULL,

    CONSTRAINT "ItemStatHistory_pkey" PRIMARY KEY ("itemStatId","revisionId")
);

-- CreateTable
CREATE TABLE "_item_itemstats" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_item_itemstats_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "ItemStat_currentId_de_key" ON "ItemStat"("currentId_de");

-- CreateIndex
CREATE UNIQUE INDEX "ItemStat_currentId_en_key" ON "ItemStat"("currentId_en");

-- CreateIndex
CREATE UNIQUE INDEX "ItemStat_currentId_es_key" ON "ItemStat"("currentId_es");

-- CreateIndex
CREATE UNIQUE INDEX "ItemStat_currentId_fr_key" ON "ItemStat"("currentId_fr");

-- CreateIndex
CREATE INDEX "_item_itemstats_B_index" ON "_item_itemstats"("B");

-- AddForeignKey
ALTER TABLE "ItemStat" ADD CONSTRAINT "ItemStat_currentId_de_fkey" FOREIGN KEY ("currentId_de") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemStat" ADD CONSTRAINT "ItemStat_currentId_en_fkey" FOREIGN KEY ("currentId_en") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemStat" ADD CONSTRAINT "ItemStat_currentId_es_fkey" FOREIGN KEY ("currentId_es") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemStat" ADD CONSTRAINT "ItemStat_currentId_fr_fkey" FOREIGN KEY ("currentId_fr") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemStatHistory" ADD CONSTRAINT "ItemStatHistory_itemStatId_fkey" FOREIGN KEY ("itemStatId") REFERENCES "ItemStat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemStatHistory" ADD CONSTRAINT "ItemStatHistory_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_item_itemstats" ADD CONSTRAINT "_item_itemstats_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_item_itemstats" ADD CONSTRAINT "_item_itemstats_B_fkey" FOREIGN KEY ("B") REFERENCES "ItemStat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
