-- CreateTable
CREATE TABLE "Skin" (
    "id" INTEGER NOT NULL,
    "name_de" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_es" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "iconId" INTEGER,
    "rarity" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL DEFAULT '',
    "subtype" TEXT,
    "weight" TEXT,
    "removedFromApi" BOOLEAN NOT NULL DEFAULT false,
    "currentId_de" TEXT NOT NULL,
    "currentId_en" TEXT NOT NULL,
    "currentId_es" TEXT NOT NULL,
    "currentId_fr" TEXT NOT NULL,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Skin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkinHistory" (
    "skinId" INTEGER NOT NULL,
    "revisionId" TEXT NOT NULL,

    CONSTRAINT "SkinHistory_pkey" PRIMARY KEY ("skinId","revisionId")
);

-- CreateTable
CREATE TABLE "_ItemToSkin" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Skin_currentId_de_key" ON "Skin"("currentId_de");

-- CreateIndex
CREATE UNIQUE INDEX "Skin_currentId_en_key" ON "Skin"("currentId_en");

-- CreateIndex
CREATE UNIQUE INDEX "Skin_currentId_es_key" ON "Skin"("currentId_es");

-- CreateIndex
CREATE UNIQUE INDEX "Skin_currentId_fr_key" ON "Skin"("currentId_fr");

-- CreateIndex
CREATE UNIQUE INDEX "_ItemToSkin_AB_unique" ON "_ItemToSkin"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemToSkin_B_index" ON "_ItemToSkin"("B");

-- AddForeignKey
ALTER TABLE "Skin" ADD CONSTRAINT "Skin_iconId_fkey" FOREIGN KEY ("iconId") REFERENCES "Icon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skin" ADD CONSTRAINT "Skin_currentId_de_fkey" FOREIGN KEY ("currentId_de") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skin" ADD CONSTRAINT "Skin_currentId_en_fkey" FOREIGN KEY ("currentId_en") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skin" ADD CONSTRAINT "Skin_currentId_es_fkey" FOREIGN KEY ("currentId_es") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skin" ADD CONSTRAINT "Skin_currentId_fr_fkey" FOREIGN KEY ("currentId_fr") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkinHistory" ADD CONSTRAINT "SkinHistory_skinId_fkey" FOREIGN KEY ("skinId") REFERENCES "Skin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkinHistory" ADD CONSTRAINT "SkinHistory_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToSkin" ADD CONSTRAINT "_ItemToSkin_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToSkin" ADD CONSTRAINT "_ItemToSkin_B_fkey" FOREIGN KEY ("B") REFERENCES "Skin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
