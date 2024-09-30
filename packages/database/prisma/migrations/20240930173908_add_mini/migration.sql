-- AlterTable
ALTER TABLE "Achievement" ADD COLUMN     "bitsMiniIds" INTEGER[];

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "unlocksMiniIds" INTEGER[];

-- CreateTable
CREATE TABLE "Mini" (
    "id" INTEGER NOT NULL,
    "name_de" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_es" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "iconId" INTEGER,
    "removedFromApi" BOOLEAN NOT NULL DEFAULT false,
    "currentId_de" TEXT NOT NULL,
    "currentId_en" TEXT NOT NULL,
    "currentId_es" TEXT NOT NULL,
    "currentId_fr" TEXT NOT NULL,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Mini_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MiniHistory" (
    "miniId" INTEGER NOT NULL,
    "revisionId" TEXT NOT NULL,

    CONSTRAINT "MiniHistory_pkey" PRIMARY KEY ("miniId","revisionId")
);

-- CreateTable
CREATE TABLE "_unlock" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_bits_mini" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Mini_currentId_de_key" ON "Mini"("currentId_de");

-- CreateIndex
CREATE UNIQUE INDEX "Mini_currentId_en_key" ON "Mini"("currentId_en");

-- CreateIndex
CREATE UNIQUE INDEX "Mini_currentId_es_key" ON "Mini"("currentId_es");

-- CreateIndex
CREATE UNIQUE INDEX "Mini_currentId_fr_key" ON "Mini"("currentId_fr");

-- CreateIndex
CREATE UNIQUE INDEX "_unlock_AB_unique" ON "_unlock"("A", "B");

-- CreateIndex
CREATE INDEX "_unlock_B_index" ON "_unlock"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_bits_mini_AB_unique" ON "_bits_mini"("A", "B");

-- CreateIndex
CREATE INDEX "_bits_mini_B_index" ON "_bits_mini"("B");

-- AddForeignKey
ALTER TABLE "Mini" ADD CONSTRAINT "Mini_iconId_fkey" FOREIGN KEY ("iconId") REFERENCES "Icon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mini" ADD CONSTRAINT "Mini_currentId_de_fkey" FOREIGN KEY ("currentId_de") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mini" ADD CONSTRAINT "Mini_currentId_en_fkey" FOREIGN KEY ("currentId_en") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mini" ADD CONSTRAINT "Mini_currentId_es_fkey" FOREIGN KEY ("currentId_es") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mini" ADD CONSTRAINT "Mini_currentId_fr_fkey" FOREIGN KEY ("currentId_fr") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MiniHistory" ADD CONSTRAINT "MiniHistory_miniId_fkey" FOREIGN KEY ("miniId") REFERENCES "Mini"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MiniHistory" ADD CONSTRAINT "MiniHistory_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_unlock" ADD CONSTRAINT "_unlock_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_unlock" ADD CONSTRAINT "_unlock_B_fkey" FOREIGN KEY ("B") REFERENCES "Mini"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_bits_mini" ADD CONSTRAINT "_bits_mini_A_fkey" FOREIGN KEY ("A") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_bits_mini" ADD CONSTRAINT "_bits_mini_B_fkey" FOREIGN KEY ("B") REFERENCES "Mini"("id") ON DELETE CASCADE ON UPDATE CASCADE;
