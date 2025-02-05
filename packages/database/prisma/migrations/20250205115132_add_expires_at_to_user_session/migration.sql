-- AlterTable
ALTER TABLE "UserSession" RENAME COLUMN "lastUsed" TO "lastUsedAt";
ALTER TABLE "UserSession" ADD COLUMN "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT (now() + '1 year'::interval);
