-- AlterTable
ALTER TABLE "HomesteadDecoration" ADD COLUMN     "categoryIds" INTEGER[],
ADD COLUMN     "maxCount" INTEGER;

-- CreateTable
CREATE TABLE "HomesteadDecorationCategory" (
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

    CONSTRAINT "HomesteadDecorationCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomesteadDecorationCategoryHistory" (
    "homesteadDecorationCategoryId" INTEGER NOT NULL,
    "revisionId" TEXT NOT NULL,

    CONSTRAINT "HomesteadDecorationCategoryHistory_pkey" PRIMARY KEY ("homesteadDecorationCategoryId","revisionId")
);

-- CreateTable
CREATE TABLE "_HomesteadDecorationToHomesteadDecorationCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "HomesteadDecorationCategory_currentId_de_key" ON "HomesteadDecorationCategory"("currentId_de");

-- CreateIndex
CREATE UNIQUE INDEX "HomesteadDecorationCategory_currentId_en_key" ON "HomesteadDecorationCategory"("currentId_en");

-- CreateIndex
CREATE UNIQUE INDEX "HomesteadDecorationCategory_currentId_es_key" ON "HomesteadDecorationCategory"("currentId_es");

-- CreateIndex
CREATE UNIQUE INDEX "HomesteadDecorationCategory_currentId_fr_key" ON "HomesteadDecorationCategory"("currentId_fr");

-- CreateIndex
CREATE UNIQUE INDEX "_HomesteadDecorationToHomesteadDecorationCategory_AB_unique" ON "_HomesteadDecorationToHomesteadDecorationCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_HomesteadDecorationToHomesteadDecorationCategory_B_index" ON "_HomesteadDecorationToHomesteadDecorationCategory"("B");

-- AddForeignKey
ALTER TABLE "HomesteadDecorationCategory" ADD CONSTRAINT "HomesteadDecorationCategory_currentId_de_fkey" FOREIGN KEY ("currentId_de") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomesteadDecorationCategory" ADD CONSTRAINT "HomesteadDecorationCategory_currentId_en_fkey" FOREIGN KEY ("currentId_en") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomesteadDecorationCategory" ADD CONSTRAINT "HomesteadDecorationCategory_currentId_es_fkey" FOREIGN KEY ("currentId_es") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomesteadDecorationCategory" ADD CONSTRAINT "HomesteadDecorationCategory_currentId_fr_fkey" FOREIGN KEY ("currentId_fr") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomesteadDecorationCategoryHistory" ADD CONSTRAINT "HomesteadDecorationCategoryHistory_homesteadDecorationCate_fkey" FOREIGN KEY ("homesteadDecorationCategoryId") REFERENCES "HomesteadDecorationCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomesteadDecorationCategoryHistory" ADD CONSTRAINT "HomesteadDecorationCategoryHistory_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HomesteadDecorationToHomesteadDecorationCategory" ADD CONSTRAINT "_HomesteadDecorationToHomesteadDecorationCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "HomesteadDecoration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HomesteadDecorationToHomesteadDecorationCategory" ADD CONSTRAINT "_HomesteadDecorationToHomesteadDecorationCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "HomesteadDecorationCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
