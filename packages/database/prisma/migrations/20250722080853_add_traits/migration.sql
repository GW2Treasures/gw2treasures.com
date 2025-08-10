-- CreateEnum
CREATE TYPE "TraitSlot" AS ENUM ('Major', 'Minor');

-- AlterTable
ALTER TABLE "Skill" ADD COLUMN     "affectedByTraitIds" INTEGER[],
ADD COLUMN     "affectedByTraitIdsRaw" INTEGER[];

-- CreateTable
CREATE TABLE "Trait" (
    "id" INTEGER NOT NULL,
    "name_de" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_es" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "iconId" INTEGER,
    "specializationId" INTEGER NOT NULL,
    "specializationIdRaw" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "tier" INTEGER NOT NULL,
    "slot" "TraitSlot" NOT NULL,
    "affectedByTraitIds" INTEGER[],
    "affectedByTraitIdsRaw" INTEGER[],
    "removedFromApi" BOOLEAN NOT NULL DEFAULT false,
    "currentId_de" TEXT NOT NULL,
    "currentId_en" TEXT NOT NULL,
    "currentId_es" TEXT NOT NULL,
    "currentId_fr" TEXT NOT NULL,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Trait_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TraitHistory" (
    "traitId" INTEGER NOT NULL,
    "revisionId" TEXT NOT NULL,

    CONSTRAINT "TraitHistory_pkey" PRIMARY KEY ("traitId","revisionId")
);

-- CreateTable
CREATE TABLE "_skill_traited_facts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_skill_traited_facts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_trait_traited_facts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_trait_traited_facts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Trait_currentId_de_key" ON "Trait"("currentId_de");

-- CreateIndex
CREATE UNIQUE INDEX "Trait_currentId_en_key" ON "Trait"("currentId_en");

-- CreateIndex
CREATE UNIQUE INDEX "Trait_currentId_es_key" ON "Trait"("currentId_es");

-- CreateIndex
CREATE UNIQUE INDEX "Trait_currentId_fr_key" ON "Trait"("currentId_fr");

-- CreateIndex
CREATE INDEX "_skill_traited_facts_B_index" ON "_skill_traited_facts"("B");

-- CreateIndex
CREATE INDEX "_trait_traited_facts_B_index" ON "_trait_traited_facts"("B");

-- AddForeignKey
ALTER TABLE "Trait" ADD CONSTRAINT "Trait_iconId_fkey" FOREIGN KEY ("iconId") REFERENCES "Icon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trait" ADD CONSTRAINT "Trait_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trait" ADD CONSTRAINT "Trait_currentId_de_fkey" FOREIGN KEY ("currentId_de") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trait" ADD CONSTRAINT "Trait_currentId_en_fkey" FOREIGN KEY ("currentId_en") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trait" ADD CONSTRAINT "Trait_currentId_es_fkey" FOREIGN KEY ("currentId_es") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trait" ADD CONSTRAINT "Trait_currentId_fr_fkey" FOREIGN KEY ("currentId_fr") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TraitHistory" ADD CONSTRAINT "TraitHistory_traitId_fkey" FOREIGN KEY ("traitId") REFERENCES "Trait"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TraitHistory" ADD CONSTRAINT "TraitHistory_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_skill_traited_facts" ADD CONSTRAINT "_skill_traited_facts_A_fkey" FOREIGN KEY ("A") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_skill_traited_facts" ADD CONSTRAINT "_skill_traited_facts_B_fkey" FOREIGN KEY ("B") REFERENCES "Trait"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_trait_traited_facts" ADD CONSTRAINT "_trait_traited_facts_A_fkey" FOREIGN KEY ("A") REFERENCES "Trait"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_trait_traited_facts" ADD CONSTRAINT "_trait_traited_facts_B_fkey" FOREIGN KEY ("B") REFERENCES "Trait"("id") ON DELETE CASCADE ON UPDATE CASCADE;
