/*
  Warnings:

  - Added the required column `order` to the `AchievementCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `AchievementGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AchievementCategory" ADD COLUMN     "order" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "AchievementGroup" ADD COLUMN     "order" INTEGER NOT NULL;
