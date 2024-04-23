-- CreateEnum
CREATE TYPE "WizardsVaultListingType" AS ENUM ('Normal', 'Featured', 'Legacy');

-- CreateTable
CREATE TABLE "WizardsVaultListing" (
    "id" INTEGER NOT NULL,
    "itemId" INTEGER,
    "itemIdRaw" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "type" "WizardsVaultListingType" NOT NULL,
    "cost" INTEGER NOT NULL,
    "removedFromApi" BOOLEAN NOT NULL DEFAULT false,
    "currentId" TEXT NOT NULL,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "WizardsVaultListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WizardsVaultListingHistory" (
    "wizardsVaultListingId" INTEGER NOT NULL,
    "revisionId" TEXT NOT NULL,

    CONSTRAINT "WizardsVaultListingHistory_pkey" PRIMARY KEY ("wizardsVaultListingId","revisionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "WizardsVaultListing_currentId_key" ON "WizardsVaultListing"("currentId");

-- AddForeignKey
ALTER TABLE "WizardsVaultListing" ADD CONSTRAINT "WizardsVaultListing_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WizardsVaultListing" ADD CONSTRAINT "WizardsVaultListing_currentId_fkey" FOREIGN KEY ("currentId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WizardsVaultListingHistory" ADD CONSTRAINT "WizardsVaultListingHistory_wizardsVaultListingId_fkey" FOREIGN KEY ("wizardsVaultListingId") REFERENCES "WizardsVaultListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WizardsVaultListingHistory" ADD CONSTRAINT "WizardsVaultListingHistory_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
