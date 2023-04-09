-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "flags" TEXT[] DEFAULT ARRAY[]::TEXT[];
