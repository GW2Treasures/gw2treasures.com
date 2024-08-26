-- Rename `currentRevisionId` to `currentId`
ALTER TABLE "Recipe" RENAME CONSTRAINT "Recipe_currentRevisionId_fkey" TO "Recipe_currentId_fkey";
ALTER INDEX "Recipe_currentRevisionId_key" RENAME TO "Recipe_currentId_key";
ALTER TABLE "Recipe" RENAME COLUMN "currentRevisionId" TO "currentId";


-- CreateTable
CREATE TABLE "RecipeHistory" (
    "recipeId" INTEGER NOT NULL,
    "revisionId" TEXT NOT NULL,

    CONSTRAINT "RecipeHistory_pkey" PRIMARY KEY ("recipeId","revisionId")
);

-- AddForeignKey
ALTER TABLE "RecipeHistory" ADD CONSTRAINT "RecipeHistory_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeHistory" ADD CONSTRAINT "RecipeHistory_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate RecipeHistory
INSERT INTO "RecipeHistory" SELECT * FROM "_RecipeToRevision";
