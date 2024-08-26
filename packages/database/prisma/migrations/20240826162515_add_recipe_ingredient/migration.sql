/*
  Warnings:

  - You are about to drop the column `currencyIngredientIds` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `guildUpgradeIngredientIds` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `itemIngredientIds` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the `IngredientCurrency` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IngredientGuildUpgrade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IngredientItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RecipeIngredientType" AS ENUM ('Item', 'Currency', 'GuildUpgrade');

-- CreateTable
CREATE TABLE "RecipeIngredient" (
    "recipeId" INTEGER NOT NULL,
    "ingredientId" INTEGER NOT NULL,
    "type" "RecipeIngredientType" NOT NULL,
    "count" INTEGER NOT NULL,
    "itemId" INTEGER,
    "currencyId" INTEGER,
    "guildUpgradeId" INTEGER,

    CONSTRAINT "RecipeIngredient_pkey" PRIMARY KEY ("recipeId","type","ingredientId")
);

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_guildUpgradeId_fkey" FOREIGN KEY ("guildUpgradeId") REFERENCES "GuildUpgrade"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- Migrate ingredients
INSERT INTO "RecipeIngredient" SELECT "recipeId",         "itemId" as "ingredientId",         'Item' as "type", "count",         "itemId", NULL as "currencyId", NULL as "guildUpgradeId" FROM "IngredientItem";
INSERT INTO "RecipeIngredient" SELECT "recipeId",     "currencyId" as "ingredientId",     'Currency' as "type", "count", NULL as "itemId",         "currencyId", NULL as "guildUpgradeId" FROM "IngredientCurrency";
INSERT INTO "RecipeIngredient" SELECT "recipeId", "guildUpgradeId" as "ingredientId", 'GuildUpgrade' as "type", "count", NULL as "itemId", NULL as "currencyId",         "guildUpgradeId" FROM "IngredientGuildUpgrade";


-- DropForeignKey
ALTER TABLE "IngredientCurrency" DROP CONSTRAINT "IngredientCurrency_currencyId_fkey";

-- DropForeignKey
ALTER TABLE "IngredientCurrency" DROP CONSTRAINT "IngredientCurrency_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "IngredientGuildUpgrade" DROP CONSTRAINT "IngredientGuildUpgrade_guildUpgradeId_fkey";

-- DropForeignKey
ALTER TABLE "IngredientGuildUpgrade" DROP CONSTRAINT "IngredientGuildUpgrade_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "IngredientItem" DROP CONSTRAINT "IngredientItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "IngredientItem" DROP CONSTRAINT "IngredientItem_recipeId_fkey";

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "currencyIngredientIds",
DROP COLUMN "guildUpgradeIngredientIds",
DROP COLUMN "itemIngredientIds";

-- DropTable
DROP TABLE "IngredientCurrency";

-- DropTable
DROP TABLE "IngredientGuildUpgrade";

-- DropTable
DROP TABLE "IngredientItem";

