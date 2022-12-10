-- AlterTable
ALTER TABLE "Achievement" ADD COLUMN     "historic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0;
