-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "iconId" INTEGER;

-- CreateTable
CREATE TABLE "Icon" (
    "id" INTEGER NOT NULL,
    "signature" TEXT NOT NULL,

    CONSTRAINT "Icon_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_iconId_fkey" FOREIGN KEY ("iconId") REFERENCES "Icon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
