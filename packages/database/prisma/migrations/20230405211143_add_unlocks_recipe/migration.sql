-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "unlocksRecipeIds" INTEGER[];

-- CreateTable
CREATE TABLE "_unlocks_recipe" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_unlocks_recipe_AB_unique" ON "_unlocks_recipe"("A", "B");

-- CreateIndex
CREATE INDEX "_unlocks_recipe_B_index" ON "_unlocks_recipe"("B");

-- AddForeignKey
ALTER TABLE "_unlocks_recipe" ADD CONSTRAINT "_unlocks_recipe_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_unlocks_recipe" ADD CONSTRAINT "_unlocks_recipe_B_fkey" FOREIGN KEY ("B") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
