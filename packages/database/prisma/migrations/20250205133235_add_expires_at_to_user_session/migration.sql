-- AlterTable
ALTER TABLE "UserSession" ALTER COLUMN "expiresAt" DROP NOT NULL;
UPDATE "UserSession" SET "expiresAt" = NULL;
