/*
  Warnings:

  - A unique constraint covering the columns `[start]` on the table `WizardsVaultSeason` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WizardsVaultSeason_start_key" ON "WizardsVaultSeason"("start");
