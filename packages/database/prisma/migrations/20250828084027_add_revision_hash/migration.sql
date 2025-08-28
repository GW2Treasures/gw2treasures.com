-- AlterTable
ALTER TABLE "public"."Revision" ADD COLUMN     "hash" TEXT NOT NULL DEFAULT '';

-- Queue migration task
INSERT INTO "public"."Job" ("id", "type", "data", "priority", "updatedAt") VALUES (gen_random_uuid(), 'revisions.hash', '{}', 0, NOW());
