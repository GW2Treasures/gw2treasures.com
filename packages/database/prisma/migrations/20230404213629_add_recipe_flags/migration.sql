-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "flags" TEXT[] DEFAULT ARRAY[]::TEXT[];
