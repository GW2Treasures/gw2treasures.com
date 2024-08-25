/*
  Warnings:

  - You are about to drop the `_HomesteadGlyphToRevision` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_HomesteadGlyphToRevision" DROP CONSTRAINT "_HomesteadGlyphToRevision_A_fkey";

-- DropForeignKey
ALTER TABLE "_HomesteadGlyphToRevision" DROP CONSTRAINT "_HomesteadGlyphToRevision_B_fkey";

-- DropTable
DROP TABLE "_HomesteadGlyphToRevision";

-- CreateTable
CREATE TABLE "HomesteadGlyphHistory" (
    "homesteadGlyphId" TEXT NOT NULL,
    "revisionId" TEXT NOT NULL,

    CONSTRAINT "HomesteadGlyphHistory_pkey" PRIMARY KEY ("homesteadGlyphId","revisionId")
);

-- AddForeignKey
ALTER TABLE "HomesteadGlyphHistory" ADD CONSTRAINT "HomesteadGlyphHistory_homesteadGlyphId_fkey" FOREIGN KEY ("homesteadGlyphId") REFERENCES "HomesteadGlyph"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomesteadGlyphHistory" ADD CONSTRAINT "HomesteadGlyphHistory_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
