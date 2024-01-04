/*
  Warnings:

  - A unique constraint covering the columns `[previousRevisionId]` on the table `Revision` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Revision" ADD COLUMN     "previousRevisionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Revision_previousRevisionId_key" ON "Revision"("previousRevisionId");

-- AddForeignKey
ALTER TABLE "Revision" ADD CONSTRAINT "Revision_previousRevisionId_fkey" FOREIGN KEY ("previousRevisionId") REFERENCES "Revision"("id") ON DELETE SET NULL ON UPDATE CASCADE;
