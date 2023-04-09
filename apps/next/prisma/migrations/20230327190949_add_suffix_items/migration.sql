-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "suffixItemIds" INTEGER[];

-- CreateTable
CREATE TABLE "_suffix" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_suffix_AB_unique" ON "_suffix"("A", "B");

-- CreateIndex
CREATE INDEX "_suffix_B_index" ON "_suffix"("B");

-- AddForeignKey
ALTER TABLE "_suffix" ADD CONSTRAINT "_suffix_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_suffix" ADD CONSTRAINT "_suffix_B_fkey" FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
