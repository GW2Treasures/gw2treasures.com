/*
  Warnings:

  - A unique constraint covering the columns `[name_en]` on the table `SkinSet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SkinSet_name_en_key" ON "SkinSet"("name_en");
