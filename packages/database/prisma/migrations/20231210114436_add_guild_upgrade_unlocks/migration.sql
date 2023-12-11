-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "unlocksGuildUpgradeIds" INTEGER[];

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "outputGuildUpgradeId" INTEGER,
ADD COLUMN     "outputGuildUpgradeIdRaw" INTEGER;

-- CreateTable
CREATE TABLE "_unlocks_guild_upgrade" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_unlocks_guild_upgrade_AB_unique" ON "_unlocks_guild_upgrade"("A", "B");

-- CreateIndex
CREATE INDEX "_unlocks_guild_upgrade_B_index" ON "_unlocks_guild_upgrade"("B");

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_outputGuildUpgradeId_fkey" FOREIGN KEY ("outputGuildUpgradeId") REFERENCES "GuildUpgrade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_unlocks_guild_upgrade" ADD CONSTRAINT "_unlocks_guild_upgrade_A_fkey" FOREIGN KEY ("A") REFERENCES "GuildUpgrade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_unlocks_guild_upgrade" ADD CONSTRAINT "_unlocks_guild_upgrade_B_fkey" FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
