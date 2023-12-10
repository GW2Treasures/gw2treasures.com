-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "guildUpgradeIngredientIds" INTEGER[];

-- CreateTable
CREATE TABLE "IngredientGuildUpgrade" (
    "recipeId" INTEGER NOT NULL,
    "guildUpgradeId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "IngredientGuildUpgrade_pkey" PRIMARY KEY ("recipeId","guildUpgradeId")
);

-- CreateTable
CREATE TABLE "GuildUpgrade" (
    "id" INTEGER NOT NULL,
    "name_de" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_es" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "iconId" INTEGER,
    "removedFromApi" BOOLEAN NOT NULL DEFAULT false,
    "currentId_de" TEXT NOT NULL,
    "currentId_en" TEXT NOT NULL,
    "currentId_es" TEXT NOT NULL,
    "currentId_fr" TEXT NOT NULL,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "GuildUpgrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuildUpgradeHistory" (
    "guildUpgradeId" INTEGER NOT NULL,
    "revisionId" TEXT NOT NULL,

    CONSTRAINT "GuildUpgradeHistory_pkey" PRIMARY KEY ("guildUpgradeId","revisionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuildUpgrade_currentId_de_key" ON "GuildUpgrade"("currentId_de");

-- CreateIndex
CREATE UNIQUE INDEX "GuildUpgrade_currentId_en_key" ON "GuildUpgrade"("currentId_en");

-- CreateIndex
CREATE UNIQUE INDEX "GuildUpgrade_currentId_es_key" ON "GuildUpgrade"("currentId_es");

-- CreateIndex
CREATE UNIQUE INDEX "GuildUpgrade_currentId_fr_key" ON "GuildUpgrade"("currentId_fr");

-- AddForeignKey
ALTER TABLE "IngredientGuildUpgrade" ADD CONSTRAINT "IngredientGuildUpgrade_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientGuildUpgrade" ADD CONSTRAINT "IngredientGuildUpgrade_guildUpgradeId_fkey" FOREIGN KEY ("guildUpgradeId") REFERENCES "GuildUpgrade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildUpgrade" ADD CONSTRAINT "GuildUpgrade_iconId_fkey" FOREIGN KEY ("iconId") REFERENCES "Icon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildUpgrade" ADD CONSTRAINT "GuildUpgrade_currentId_de_fkey" FOREIGN KEY ("currentId_de") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildUpgrade" ADD CONSTRAINT "GuildUpgrade_currentId_en_fkey" FOREIGN KEY ("currentId_en") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildUpgrade" ADD CONSTRAINT "GuildUpgrade_currentId_es_fkey" FOREIGN KEY ("currentId_es") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildUpgrade" ADD CONSTRAINT "GuildUpgrade_currentId_fr_fkey" FOREIGN KEY ("currentId_fr") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildUpgradeHistory" ADD CONSTRAINT "GuildUpgradeHistory_guildUpgradeId_fkey" FOREIGN KEY ("guildUpgradeId") REFERENCES "GuildUpgrade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildUpgradeHistory" ADD CONSTRAINT "GuildUpgradeHistory_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
