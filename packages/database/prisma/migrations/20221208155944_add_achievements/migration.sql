/*
  Warnings:

  - The primary key for the `AchievementCategoryHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `achievmentCategoryId` on the `AchievementCategoryHistory` table. All the data in the column will be lost.
  - The primary key for the `AchievementGroupHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `achievmentGroupId` on the `AchievementGroupHistory` table. All the data in the column will be lost.
  - The primary key for the `AchievementHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `achievmentId` on the `AchievementHistory` table. All the data in the column will be lost.
  - Added the required column `achievementCategoryId` to the `AchievementCategoryHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `achievementGroupId` to the `AchievementGroupHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `achievementId` to the `AchievementHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AchievementCategoryHistory" DROP CONSTRAINT "AchievementCategoryHistory_achievmentCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "AchievementGroupHistory" DROP CONSTRAINT "AchievementGroupHistory_achievmentGroupId_fkey";

-- DropForeignKey
ALTER TABLE "AchievementHistory" DROP CONSTRAINT "AchievementHistory_achievmentId_fkey";

-- AlterTable
ALTER TABLE "AchievementCategoryHistory" DROP CONSTRAINT "AchievementCategoryHistory_pkey",
DROP COLUMN "achievmentCategoryId",
ADD COLUMN     "achievementCategoryId" INTEGER NOT NULL,
ADD CONSTRAINT "AchievementCategoryHistory_pkey" PRIMARY KEY ("achievementCategoryId", "revisionId");

-- AlterTable
ALTER TABLE "AchievementGroupHistory" DROP CONSTRAINT "AchievementGroupHistory_pkey",
DROP COLUMN "achievmentGroupId",
ADD COLUMN     "achievementGroupId" TEXT NOT NULL,
ADD CONSTRAINT "AchievementGroupHistory_pkey" PRIMARY KEY ("achievementGroupId", "revisionId");

-- AlterTable
ALTER TABLE "AchievementHistory" DROP CONSTRAINT "AchievementHistory_pkey",
DROP COLUMN "achievmentId",
ADD COLUMN     "achievementId" INTEGER NOT NULL,
ADD CONSTRAINT "AchievementHistory_pkey" PRIMARY KEY ("achievementId", "revisionId");

-- AddForeignKey
ALTER TABLE "AchievementHistory" ADD CONSTRAINT "AchievementHistory_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementGroupHistory" ADD CONSTRAINT "AchievementGroupHistory_achievementGroupId_fkey" FOREIGN KEY ("achievementGroupId") REFERENCES "AchievementGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementCategoryHistory" ADD CONSTRAINT "AchievementCategoryHistory_achievementCategoryId_fkey" FOREIGN KEY ("achievementCategoryId") REFERENCES "AchievementCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
