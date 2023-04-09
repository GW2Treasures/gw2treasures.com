-- CreateEnum
CREATE TYPE "MasteryRegion" AS ENUM ('Tyria', 'Desert', 'Maguuma', 'Tundra', 'Unknown');

-- AlterTable
ALTER TABLE "Achievement" ADD COLUMN     "mastery" "MasteryRegion";
