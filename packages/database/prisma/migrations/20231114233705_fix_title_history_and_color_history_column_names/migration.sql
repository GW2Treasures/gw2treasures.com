/*
  Warnings:

  - The primary key for the `ColorHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `titleId` on the `ColorHistory` table. All the data in the column will be lost.
  - Added the required column `colorId` to the `ColorHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ColorHistory" DROP CONSTRAINT "ColorHistory_titleId_fkey";

-- AlterTable
ALTER TABLE "ColorHistory" DROP CONSTRAINT "ColorHistory_pkey",
DROP COLUMN "titleId",
ADD COLUMN     "colorId" INTEGER NOT NULL,
ADD CONSTRAINT "ColorHistory_pkey" PRIMARY KEY ("colorId", "revisionId");

-- AddForeignKey
ALTER TABLE "ColorHistory" ADD CONSTRAINT "ColorHistory_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE CASCADE ON UPDATE CASCADE;
