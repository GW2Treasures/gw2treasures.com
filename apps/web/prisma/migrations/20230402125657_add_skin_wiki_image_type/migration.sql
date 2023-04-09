-- CreateEnum
CREATE TYPE "WikiImageType" AS ENUM ('Skin', 'Set');

-- AlterTable
ALTER TABLE "Skin" ADD COLUMN     "wikiImageType" "WikiImageType";
