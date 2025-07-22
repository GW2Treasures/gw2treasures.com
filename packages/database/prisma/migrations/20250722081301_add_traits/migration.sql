/*
  Warnings:

  - You are about to drop the column `affectedByTraitIds` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `affectedByTraitIds` on the `Trait` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "affectedByTraitIds";

-- AlterTable
ALTER TABLE "Trait" DROP COLUMN "affectedByTraitIds";
