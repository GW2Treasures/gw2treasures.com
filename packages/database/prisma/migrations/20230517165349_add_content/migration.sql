-- CreateEnum
CREATE TYPE "ContentChance" AS ENUM ('Chance', 'Choice', 'Guaranteed');

-- CreateTable
CREATE TABLE "Content" (
    "containerItemId" INTEGER NOT NULL,
    "contentItemId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "chance" "ContentChance" NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("containerItemId","contentItemId")
);

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_containerItemId_fkey" FOREIGN KEY ("containerItemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
