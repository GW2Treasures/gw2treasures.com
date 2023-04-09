/*
  Warnings:

  - You are about to drop the `_bits` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_rewards` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_bits" DROP CONSTRAINT "_bits_A_fkey";

-- DropForeignKey
ALTER TABLE "_bits" DROP CONSTRAINT "_bits_B_fkey";

-- DropForeignKey
ALTER TABLE "_rewards" DROP CONSTRAINT "_rewards_A_fkey";

-- DropForeignKey
ALTER TABLE "_rewards" DROP CONSTRAINT "_rewards_B_fkey";

-- DropTable
DROP TABLE "_bits";

-- DropTable
DROP TABLE "_rewards";

-- CreateTable
CREATE TABLE "_bits_item" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_bits_skin" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_rewards_item" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_bits_item_AB_unique" ON "_bits_item"("A", "B");

-- CreateIndex
CREATE INDEX "_bits_item_B_index" ON "_bits_item"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_bits_skin_AB_unique" ON "_bits_skin"("A", "B");

-- CreateIndex
CREATE INDEX "_bits_skin_B_index" ON "_bits_skin"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_rewards_item_AB_unique" ON "_rewards_item"("A", "B");

-- CreateIndex
CREATE INDEX "_rewards_item_B_index" ON "_rewards_item"("B");

-- AddForeignKey
ALTER TABLE "_bits_item" ADD CONSTRAINT "_bits_item_A_fkey" FOREIGN KEY ("A") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_bits_item" ADD CONSTRAINT "_bits_item_B_fkey" FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_bits_skin" ADD CONSTRAINT "_bits_skin_A_fkey" FOREIGN KEY ("A") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_bits_skin" ADD CONSTRAINT "_bits_skin_B_fkey" FOREIGN KEY ("B") REFERENCES "Skin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_rewards_item" ADD CONSTRAINT "_rewards_item_A_fkey" FOREIGN KEY ("A") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_rewards_item" ADD CONSTRAINT "_rewards_item_B_fkey" FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
