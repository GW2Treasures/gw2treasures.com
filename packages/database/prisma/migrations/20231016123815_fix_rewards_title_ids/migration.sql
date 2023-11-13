/*
  Warnings:

  - You are about to drop the column `rewardsTitleId` on the `Achievement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Achievement" DROP COLUMN "rewardsTitleId",
ADD COLUMN     "rewardsTitleIds" INTEGER[];
