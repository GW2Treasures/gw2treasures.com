-- AlterTable
ALTER TABLE "Item" RENAME COLUMN "value" TO "vendorValue";
ALTER TABLE "Item" ALTER COLUMN "vendorValue" DROP NOT NULL;
ALTER TABLE "Item" ALTER COLUMN "vendorValue" DROP DEFAULT;
