-- AlterTable
ALTER TABLE "AchievementCategory" ADD COLUMN     "categoryDisplayId" INTEGER;

-- AddForeignKey
ALTER TABLE "AchievementCategory" ADD CONSTRAINT "AchievementCategory_categoryDisplayId_fkey" FOREIGN KEY ("categoryDisplayId") REFERENCES "Achievement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
