-- CreateTable
CREATE TABLE "MysticForgeRecipe" (
    "id" TEXT NOT NULL,
    "outputCountMin" INTEGER NOT NULL,
    "outputCountMax" INTEGER NOT NULL,
    "outputItemId" INTEGER,
    "outputItemIdRaw" INTEGER,
    "itemIngredientIds" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MysticForgeRecipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MysticForgeIngredientItem" (
    "mysticForgeRecipeId" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "MysticForgeIngredientItem_pkey" PRIMARY KEY ("mysticForgeRecipeId","itemId")
);

-- AddForeignKey
ALTER TABLE "MysticForgeRecipe" ADD CONSTRAINT "MysticForgeRecipe_outputItemId_fkey" FOREIGN KEY ("outputItemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MysticForgeIngredientItem" ADD CONSTRAINT "MysticForgeIngredientItem_mysticForgeRecipeId_fkey" FOREIGN KEY ("mysticForgeRecipeId") REFERENCES "MysticForgeRecipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MysticForgeIngredientItem" ADD CONSTRAINT "MysticForgeIngredientItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
