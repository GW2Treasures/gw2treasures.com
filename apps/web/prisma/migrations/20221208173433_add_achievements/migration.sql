-- AlterTable
ALTER TABLE "AchievementCategory" ADD COLUMN     "iconId" INTEGER;

-- AddForeignKey
ALTER TABLE "AchievementCategory" ADD CONSTRAINT "AchievementCategory_iconId_fkey" FOREIGN KEY ("iconId") REFERENCES "Icon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
