-- AlterTable
ALTER TABLE "UserProvider" ADD COLUMN     "scope" TEXT[] DEFAULT ARRAY[]::TEXT[];
