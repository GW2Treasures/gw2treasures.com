/*
  Warnings:

  - You are about to drop the `_RecipeToRevision` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_RecipeToRevision" DROP CONSTRAINT "_RecipeToRevision_A_fkey";

-- DropForeignKey
ALTER TABLE "_RecipeToRevision" DROP CONSTRAINT "_RecipeToRevision_B_fkey";

-- DropTable
DROP TABLE "_RecipeToRevision";
