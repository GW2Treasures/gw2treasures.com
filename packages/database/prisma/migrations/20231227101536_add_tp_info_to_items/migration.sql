-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "buyPrice" INTEGER,
ADD COLUMN     "buyQuantity" INTEGER,
ADD COLUMN     "sellPrice" INTEGER,
ADD COLUMN     "sellQuantity" INTEGER,
ADD COLUMN     "tpTradeable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tpWhitelisted" BOOLEAN NOT NULL DEFAULT false;
