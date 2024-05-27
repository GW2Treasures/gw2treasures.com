-- DropForeignKey
ALTER TABLE "ApplicationApiRequest" DROP CONSTRAINT "ApplicationApiRequest_applicationId_fkey";

-- DropIndex
DROP INDEX "ApplicationApiRequest_time_idx";

-- AddForeignKey
ALTER TABLE "ApplicationApiRequest" ADD CONSTRAINT "ApplicationApiRequest_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
