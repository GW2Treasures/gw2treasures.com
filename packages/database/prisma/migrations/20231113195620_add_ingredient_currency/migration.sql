-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "currencyIngredientIds" INTEGER[];

-- CreateTable
CREATE TABLE "IngredientCurrency" (
    "recipeId" INTEGER NOT NULL,
    "currencyId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "IngredientCurrency_pkey" PRIMARY KEY ("recipeId","currencyId")
);

-- AddForeignKey
ALTER TABLE "IngredientCurrency" ADD CONSTRAINT "IngredientCurrency_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientCurrency" ADD CONSTRAINT "IngredientCurrency_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE CASCADE ON UPDATE CASCADE;
