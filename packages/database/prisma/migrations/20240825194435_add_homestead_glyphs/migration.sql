-- CreateEnum
CREATE TYPE "HomesteadGlyphSlot" AS ENUM ('harvesting', 'logging', 'mining');

-- CreateTable
CREATE TABLE "HomesteadGlyph" (
    "id" TEXT NOT NULL,
    "slot" "HomesteadGlyphSlot" NOT NULL,
    "itemId" INTEGER,
    "itemIdRaw" INTEGER NOT NULL,
    "removedFromApi" BOOLEAN NOT NULL DEFAULT false,
    "currentId" TEXT NOT NULL,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "HomesteadGlyph_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_HomesteadGlyphToRevision" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "HomesteadGlyph_currentId_key" ON "HomesteadGlyph"("currentId");

-- CreateIndex
CREATE UNIQUE INDEX "_HomesteadGlyphToRevision_AB_unique" ON "_HomesteadGlyphToRevision"("A", "B");

-- CreateIndex
CREATE INDEX "_HomesteadGlyphToRevision_B_index" ON "_HomesteadGlyphToRevision"("B");

-- AddForeignKey
ALTER TABLE "HomesteadGlyph" ADD CONSTRAINT "HomesteadGlyph_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomesteadGlyph" ADD CONSTRAINT "HomesteadGlyph_currentId_fkey" FOREIGN KEY ("currentId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HomesteadGlyphToRevision" ADD CONSTRAINT "_HomesteadGlyphToRevision_A_fkey" FOREIGN KEY ("A") REFERENCES "HomesteadGlyph"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HomesteadGlyphToRevision" ADD CONSTRAINT "_HomesteadGlyphToRevision_B_fkey" FOREIGN KEY ("B") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
