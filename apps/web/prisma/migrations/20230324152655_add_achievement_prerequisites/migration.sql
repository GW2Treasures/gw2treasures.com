-- AlterTable
ALTER TABLE "Achievement" ADD COLUMN     "prerequisitesIds" INTEGER[];

-- CreateTable
CREATE TABLE "_prerequisites" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_prerequisites_AB_unique" ON "_prerequisites"("A", "B");

-- CreateIndex
CREATE INDEX "_prerequisites_B_index" ON "_prerequisites"("B");

-- AddForeignKey
ALTER TABLE "_prerequisites" ADD CONSTRAINT "_prerequisites_A_fkey" FOREIGN KEY ("A") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_prerequisites" ADD CONSTRAINT "_prerequisites_B_fkey" FOREIGN KEY ("B") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
