-- AlterTable
ALTER TABLE "Achievement" ADD COLUMN     "rewardsTitleId" INTEGER[];

-- CreateTable
CREATE TABLE "Title" (
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

    CONSTRAINT "Title_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TitleHistory" (
    "titleId" INTEGER NOT NULL,
    "revisionId" TEXT NOT NULL,

    CONSTRAINT "TitleHistory_pkey" PRIMARY KEY ("titleId","revisionId")
);

-- CreateTable
CREATE TABLE "_rewards_title" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Title_currentId_de_key" ON "Title"("currentId_de");

-- CreateIndex
CREATE UNIQUE INDEX "Title_currentId_en_key" ON "Title"("currentId_en");

-- CreateIndex
CREATE UNIQUE INDEX "Title_currentId_es_key" ON "Title"("currentId_es");

-- CreateIndex
CREATE UNIQUE INDEX "Title_currentId_fr_key" ON "Title"("currentId_fr");

-- CreateIndex
CREATE UNIQUE INDEX "_rewards_title_AB_unique" ON "_rewards_title"("A", "B");

-- CreateIndex
CREATE INDEX "_rewards_title_B_index" ON "_rewards_title"("B");

-- AddForeignKey
ALTER TABLE "Title" ADD CONSTRAINT "Title_currentId_de_fkey" FOREIGN KEY ("currentId_de") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Title" ADD CONSTRAINT "Title_currentId_en_fkey" FOREIGN KEY ("currentId_en") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Title" ADD CONSTRAINT "Title_currentId_es_fkey" FOREIGN KEY ("currentId_es") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Title" ADD CONSTRAINT "Title_currentId_fr_fkey" FOREIGN KEY ("currentId_fr") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TitleHistory" ADD CONSTRAINT "TitleHistory_titleId_fkey" FOREIGN KEY ("titleId") REFERENCES "Title"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TitleHistory" ADD CONSTRAINT "TitleHistory_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_rewards_title" ADD CONSTRAINT "_rewards_title_A_fkey" FOREIGN KEY ("A") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_rewards_title" ADD CONSTRAINT "_rewards_title_B_fkey" FOREIGN KEY ("B") REFERENCES "Title"("id") ON DELETE CASCADE ON UPDATE CASCADE;
