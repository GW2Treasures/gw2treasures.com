-- CreateTable
CREATE TABLE "WizardsVaultSeason" (
    "id" TEXT NOT NULL,
    "name_de" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_es" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "currentId_de" TEXT NOT NULL,
    "currentId_en" TEXT NOT NULL,
    "currentId_es" TEXT NOT NULL,
    "currentId_fr" TEXT NOT NULL,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "WizardsVaultSeason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WizardsVaultSeasonHistory" (
    "wizardsVaultSeasonId" TEXT NOT NULL,
    "revisionId" TEXT NOT NULL,

    CONSTRAINT "WizardsVaultSeasonHistory_pkey" PRIMARY KEY ("wizardsVaultSeasonId","revisionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "WizardsVaultSeason_currentId_de_key" ON "WizardsVaultSeason"("currentId_de");

-- CreateIndex
CREATE UNIQUE INDEX "WizardsVaultSeason_currentId_en_key" ON "WizardsVaultSeason"("currentId_en");

-- CreateIndex
CREATE UNIQUE INDEX "WizardsVaultSeason_currentId_es_key" ON "WizardsVaultSeason"("currentId_es");

-- CreateIndex
CREATE UNIQUE INDEX "WizardsVaultSeason_currentId_fr_key" ON "WizardsVaultSeason"("currentId_fr");

-- AddForeignKey
ALTER TABLE "WizardsVaultSeason" ADD CONSTRAINT "WizardsVaultSeason_currentId_de_fkey" FOREIGN KEY ("currentId_de") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WizardsVaultSeason" ADD CONSTRAINT "WizardsVaultSeason_currentId_en_fkey" FOREIGN KEY ("currentId_en") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WizardsVaultSeason" ADD CONSTRAINT "WizardsVaultSeason_currentId_es_fkey" FOREIGN KEY ("currentId_es") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WizardsVaultSeason" ADD CONSTRAINT "WizardsVaultSeason_currentId_fr_fkey" FOREIGN KEY ("currentId_fr") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WizardsVaultSeasonHistory" ADD CONSTRAINT "WizardsVaultSeasonHistory_wizardsVaultSeasonId_fkey" FOREIGN KEY ("wizardsVaultSeasonId") REFERENCES "WizardsVaultSeason"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WizardsVaultSeasonHistory" ADD CONSTRAINT "WizardsVaultSeasonHistory_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
