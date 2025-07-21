-- CreateTable
CREATE TABLE "Profession" (
    "id" TEXT NOT NULL,
    "name_de" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_es" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "iconId" INTEGER,
    "iconBigId" INTEGER,
    "skillIds" INTEGER[],
    "removedFromApi" BOOLEAN NOT NULL DEFAULT false,
    "currentId_de" TEXT NOT NULL,
    "currentId_en" TEXT NOT NULL,
    "currentId_es" TEXT NOT NULL,
    "currentId_fr" TEXT NOT NULL,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Profession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionHistory" (
    "professionId" TEXT NOT NULL,
    "revisionId" TEXT NOT NULL,

    CONSTRAINT "ProfessionHistory_pkey" PRIMARY KEY ("professionId","revisionId")
);

-- CreateTable
CREATE TABLE "_ProfessionToSkill" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProfessionToSkill_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profession_currentId_de_key" ON "Profession"("currentId_de");

-- CreateIndex
CREATE UNIQUE INDEX "Profession_currentId_en_key" ON "Profession"("currentId_en");

-- CreateIndex
CREATE UNIQUE INDEX "Profession_currentId_es_key" ON "Profession"("currentId_es");

-- CreateIndex
CREATE UNIQUE INDEX "Profession_currentId_fr_key" ON "Profession"("currentId_fr");

-- CreateIndex
CREATE INDEX "_ProfessionToSkill_B_index" ON "_ProfessionToSkill"("B");

-- AddForeignKey
ALTER TABLE "Profession" ADD CONSTRAINT "Profession_iconId_fkey" FOREIGN KEY ("iconId") REFERENCES "Icon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profession" ADD CONSTRAINT "Profession_iconBigId_fkey" FOREIGN KEY ("iconBigId") REFERENCES "Icon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profession" ADD CONSTRAINT "Profession_currentId_de_fkey" FOREIGN KEY ("currentId_de") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profession" ADD CONSTRAINT "Profession_currentId_en_fkey" FOREIGN KEY ("currentId_en") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profession" ADD CONSTRAINT "Profession_currentId_es_fkey" FOREIGN KEY ("currentId_es") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profession" ADD CONSTRAINT "Profession_currentId_fr_fkey" FOREIGN KEY ("currentId_fr") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionHistory" ADD CONSTRAINT "ProfessionHistory_professionId_fkey" FOREIGN KEY ("professionId") REFERENCES "Profession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionHistory" ADD CONSTRAINT "ProfessionHistory_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfessionToSkill" ADD CONSTRAINT "_ProfessionToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "Profession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfessionToSkill" ADD CONSTRAINT "_ProfessionToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
