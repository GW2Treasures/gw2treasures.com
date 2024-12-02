-- AlterTable
ALTER TABLE "Skin" ADD COLUMN     "setId" TEXT;

-- CreateTable
CREATE TABLE "SkinSet" (
    "id" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkinSet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Skin" ADD CONSTRAINT "Skin_setId_fkey" FOREIGN KEY ("setId") REFERENCES "SkinSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
