/*
  Warnings:

  - You are about to drop the column `approvedAt` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `approverId` on the `Review` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ReviewState" AS ENUM ('Open', 'Approved', 'Rejected');

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_approverId_fkey";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "approvedAt",
DROP COLUMN "approverId",
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewerId" TEXT,
ADD COLUMN     "state" "ReviewState" NOT NULL DEFAULT 'Open';

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
