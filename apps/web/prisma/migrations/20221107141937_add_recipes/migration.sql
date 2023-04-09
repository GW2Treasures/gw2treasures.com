-- CreateTable
CREATE TABLE "Recipe" (
    "id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "disciplines" TEXT[],
    "outputCount" INTEGER NOT NULL,
    "outputItemId" INTEGER NOT NULL,
    "timeToCraftMs" INTEGER NOT NULL,
    "currentRevisionId" TEXT NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngredientItem" (
    "recipeId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "IngredientItem_pkey" PRIMARY KEY ("recipeId","itemId")
);

-- CreateTable
CREATE TABLE "_RecipeToRevision" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_currentRevisionId_key" ON "Recipe"("currentRevisionId");

-- CreateIndex
CREATE UNIQUE INDEX "_RecipeToRevision_AB_unique" ON "_RecipeToRevision"("A", "B");

-- CreateIndex
CREATE INDEX "_RecipeToRevision_B_index" ON "_RecipeToRevision"("B");

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_outputItemId_fkey" FOREIGN KEY ("outputItemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_currentRevisionId_fkey" FOREIGN KEY ("currentRevisionId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientItem" ADD CONSTRAINT "IngredientItem_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientItem" ADD CONSTRAINT "IngredientItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipeToRevision" ADD CONSTRAINT "_RecipeToRevision_A_fkey" FOREIGN KEY ("A") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipeToRevision" ADD CONSTRAINT "_RecipeToRevision_B_fkey" FOREIGN KEY ("B") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
