/*
  Warnings:

  - A unique constraint covering the columns `[revisionId]` on the table `ItemHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ItemHistory_revisionId_key" ON "ItemHistory"("revisionId");
