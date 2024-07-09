/*
  Warnings:

  - A unique constraint covering the columns `[requestId,time,applicationId,endpoint]` on the table `ApplicationApiRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ApplicationApiRequest_time_applicationId_endpoint_key";

-- AlterTable
ALTER TABLE "ApplicationApiRequest" ADD COLUMN     "requestId" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationApiRequest_requestId_time_applicationId_endpoint_key" ON "ApplicationApiRequest"("requestId", "time", "applicationId", "endpoint");

ALTER TABLE "ApplicationApiRequest" ALTER COLUMN     "requestId" DROP DEFAULT;
