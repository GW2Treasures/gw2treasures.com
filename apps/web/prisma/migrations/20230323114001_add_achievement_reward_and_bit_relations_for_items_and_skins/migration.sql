-- AlterTable
ALTER TABLE "Achievement" ADD COLUMN     "bitsItemIds" INTEGER[],
ADD COLUMN     "bitsSkinIds" INTEGER[],
ADD COLUMN     "rewardsItemIds" INTEGER[];

-- CreateTable
CREATE TABLE "_bits" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_rewards" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_bits_AB_unique" ON "_bits"("A", "B");

-- CreateIndex
CREATE INDEX "_bits_B_index" ON "_bits"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_rewards_AB_unique" ON "_rewards"("A", "B");

-- CreateIndex
CREATE INDEX "_rewards_B_index" ON "_rewards"("B");

-- AddForeignKey
ALTER TABLE "_bits" ADD CONSTRAINT "_bits_A_fkey" FOREIGN KEY ("A") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_bits" ADD CONSTRAINT "_bits_B_fkey" FOREIGN KEY ("B") REFERENCES "Skin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_rewards" ADD CONSTRAINT "_rewards_A_fkey" FOREIGN KEY ("A") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_rewards" ADD CONSTRAINT "_rewards_B_fkey" FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
