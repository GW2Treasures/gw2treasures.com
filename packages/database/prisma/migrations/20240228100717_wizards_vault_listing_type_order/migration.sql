-- change order of WizardsVaultListingType enum values
ALTER TYPE "WizardsVaultListingType" RENAME TO "WizardsVaultListingType_old";
CREATE TYPE "WizardsVaultListingType" AS ENUM ('Featured', 'Normal', 'Legacy');
ALTER TABLE "WizardsVaultListing" ALTER "type" TYPE "WizardsVaultListingType" USING "type"::TEXT::"WizardsVaultListingType";
DROP TYPE "WizardsVaultListingType_old";
