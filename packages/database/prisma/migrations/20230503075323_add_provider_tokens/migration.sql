/*
  Warnings:

  - You are about to drop the column `token` on the `UserProvider` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserProvider" DROP COLUMN "token",
ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "accessTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "refreshTokenExpiresAt" TIMESTAMP(3);
