-- CreateTable
CREATE TABLE "Glider" (
    "id" INTEGER NOT NULL,
    "name_de" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_es" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "iconId" INTEGER,
    "order" INTEGER NOT NULL,
    "unlockedByItemIds" INTEGER[],
    "unlocks" DOUBLE PRECISION,
    "removedFromApi" BOOLEAN NOT NULL DEFAULT false,
    "currentId_de" TEXT NOT NULL,
    "currentId_en" TEXT NOT NULL,
    "currentId_es" TEXT NOT NULL,
    "currentId_fr" TEXT NOT NULL,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Glider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GliderHistory" (
    "gliderId" INTEGER NOT NULL,
    "revisionId" TEXT NOT NULL,

    CONSTRAINT "GliderHistory_pkey" PRIMARY KEY ("gliderId","revisionId")
);

-- CreateTable
CREATE TABLE "_unlocks_glider" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_unlocks_glider_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Glider_currentId_de_key" ON "Glider"("currentId_de");

-- CreateIndex
CREATE UNIQUE INDEX "Glider_currentId_en_key" ON "Glider"("currentId_en");

-- CreateIndex
CREATE UNIQUE INDEX "Glider_currentId_es_key" ON "Glider"("currentId_es");

-- CreateIndex
CREATE UNIQUE INDEX "Glider_currentId_fr_key" ON "Glider"("currentId_fr");

-- CreateIndex
CREATE INDEX "_unlocks_glider_B_index" ON "_unlocks_glider"("B");

-- AddForeignKey
ALTER TABLE "Glider" ADD CONSTRAINT "Glider_iconId_fkey" FOREIGN KEY ("iconId") REFERENCES "Icon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Glider" ADD CONSTRAINT "Glider_currentId_de_fkey" FOREIGN KEY ("currentId_de") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Glider" ADD CONSTRAINT "Glider_currentId_en_fkey" FOREIGN KEY ("currentId_en") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Glider" ADD CONSTRAINT "Glider_currentId_es_fkey" FOREIGN KEY ("currentId_es") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Glider" ADD CONSTRAINT "Glider_currentId_fr_fkey" FOREIGN KEY ("currentId_fr") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GliderHistory" ADD CONSTRAINT "GliderHistory_gliderId_fkey" FOREIGN KEY ("gliderId") REFERENCES "Glider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GliderHistory" ADD CONSTRAINT "GliderHistory_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_unlocks_glider" ADD CONSTRAINT "_unlocks_glider_A_fkey" FOREIGN KEY ("A") REFERENCES "Glider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_unlocks_glider" ADD CONSTRAINT "_unlocks_glider_B_fkey" FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
