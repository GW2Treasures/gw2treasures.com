-- CreateEnum
CREATE TYPE "WizardsVaultTrack" AS ENUM ('PvE', 'PvP', 'WvW');

-- CreateTable
CREATE TABLE "WizardsVaultObjective" (
    "id" INTEGER NOT NULL,
    "name_de" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_es" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "track" "WizardsVaultTrack" NOT NULL,
    "acclaim" INTEGER NOT NULL,
    "waypointId" INTEGER,
    "removedFromApi" BOOLEAN NOT NULL DEFAULT false,
    "currentId_de" TEXT NOT NULL,
    "currentId_en" TEXT NOT NULL,
    "currentId_es" TEXT NOT NULL,
    "currentId_fr" TEXT NOT NULL,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "WizardsVaultObjective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WizardsVaultObjectiveHistory" (
    "wizardsVaultObjectiveId" INTEGER NOT NULL,
    "revisionId" TEXT NOT NULL,

    CONSTRAINT "WizardsVaultObjectiveHistory_pkey" PRIMARY KEY ("wizardsVaultObjectiveId","revisionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "WizardsVaultObjective_currentId_de_key" ON "WizardsVaultObjective"("currentId_de");

-- CreateIndex
CREATE UNIQUE INDEX "WizardsVaultObjective_currentId_en_key" ON "WizardsVaultObjective"("currentId_en");

-- CreateIndex
CREATE UNIQUE INDEX "WizardsVaultObjective_currentId_es_key" ON "WizardsVaultObjective"("currentId_es");

-- CreateIndex
CREATE UNIQUE INDEX "WizardsVaultObjective_currentId_fr_key" ON "WizardsVaultObjective"("currentId_fr");

-- AddForeignKey
ALTER TABLE "WizardsVaultObjective" ADD CONSTRAINT "WizardsVaultObjective_currentId_de_fkey" FOREIGN KEY ("currentId_de") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WizardsVaultObjective" ADD CONSTRAINT "WizardsVaultObjective_currentId_en_fkey" FOREIGN KEY ("currentId_en") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WizardsVaultObjective" ADD CONSTRAINT "WizardsVaultObjective_currentId_es_fkey" FOREIGN KEY ("currentId_es") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WizardsVaultObjective" ADD CONSTRAINT "WizardsVaultObjective_currentId_fr_fkey" FOREIGN KEY ("currentId_fr") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WizardsVaultObjectiveHistory" ADD CONSTRAINT "WizardsVaultObjectiveHistory_wizardsVaultObjectiveId_fkey" FOREIGN KEY ("wizardsVaultObjectiveId") REFERENCES "WizardsVaultObjective"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WizardsVaultObjectiveHistory" ADD CONSTRAINT "WizardsVaultObjectiveHistory_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
