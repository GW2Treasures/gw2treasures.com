-- AlterTable
ALTER TABLE "Skin" ALTER COLUMN "rarity" DROP DEFAULT;
ALTER TABLE "Skin" ALTER COLUMN "rarity" TYPE "Rarity" USING "rarity"::"Rarity";
