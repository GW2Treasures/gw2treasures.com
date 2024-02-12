-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('Junk', 'Basic', 'Fine', 'Masterwork', 'Rare', 'Exotic', 'Ascended', 'Legendary');

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "rarity" DROP DEFAULT;
ALTER TABLE "Item" ALTER COLUMN "rarity" TYPE "Rarity" USING "rarity"::"Rarity";
