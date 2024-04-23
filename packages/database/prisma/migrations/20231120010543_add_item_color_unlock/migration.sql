-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "unlocksColorIds" INTEGER[];

-- CreateTable
CREATE TABLE "_unlocks_color" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_unlocks_color_AB_unique" ON "_unlocks_color"("A", "B");

-- CreateIndex
CREATE INDEX "_unlocks_color_B_index" ON "_unlocks_color"("B");

-- AddForeignKey
ALTER TABLE "_unlocks_color" ADD CONSTRAINT "_unlocks_color_A_fkey" FOREIGN KEY ("A") REFERENCES "Color"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_unlocks_color" ADD CONSTRAINT "_unlocks_color_B_fkey" FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
