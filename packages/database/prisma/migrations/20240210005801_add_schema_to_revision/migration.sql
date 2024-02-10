ALTER TABLE "Revision" ADD COLUMN "schema" TEXT NOT NULL DEFAULT 'v2+2022-03-23T19:00:00.000Z';

UPDATE "Revision" SET "schema" = '' WHERE "type" = 'Import';

ALTER TABLE "Revision" ALTER COLUMN "schema" DROP DEFAULT;
