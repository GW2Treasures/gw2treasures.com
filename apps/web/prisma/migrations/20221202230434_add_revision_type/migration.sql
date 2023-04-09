-- CreateEnum
CREATE TYPE "RevisionType" AS ENUM ('Update', 'Import', 'Added', 'Removed');

-- AlterTable
ALTER TABLE "Revision" ADD COLUMN     "entity" TEXT,
ADD COLUMN     "type" "RevisionType" NOT NULL DEFAULT 'Update';

-- Update RevisionType
UPDATE "Revision" SET "type" = 'Added' WHERE "description" = 'Added to API';
UPDATE "Revision" SET "type" = 'Import' WHERE "description" = 'Imported - No earlier history available';
UPDATE "Revision" SET "type" = 'Removed' WHERE "description" = 'Removed from API';

-- Update entity
UPDATE "Revision" SET "entity" = 'Item' WHERE "id" in (SELECT "revisionId" FROM "ItemHistory");
UPDATE "Revision" SET "entity" = 'Skill' WHERE "id" in (SELECT "revisionId" FROM "SkillHistory");
UPDATE "Revision" SET "entity" = 'Skin' WHERE "id" in (SELECT "revisionId" FROM "SkinHistory");
UPDATE "Revision" SET "entity" = 'Recipe' WHERE "id" in (SELECT "B" FROM "_RecipeToRevision");
