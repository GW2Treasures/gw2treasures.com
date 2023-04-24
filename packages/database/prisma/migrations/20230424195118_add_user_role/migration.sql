-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Admin');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roles" "UserRole"[] DEFAULT ARRAY[]::"UserRole"[];
