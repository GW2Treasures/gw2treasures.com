-- CreateEnum
CREATE TYPE "ReviewQueue" AS ENUM ('ContainerContent');

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT,
    "approverId" TEXT,
    "queue" "ReviewQueue" NOT NULL,
    "changes" JSONB NOT NULL,
    "relatedItemId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_relatedItemId_fkey" FOREIGN KEY ("relatedItemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
