-- AlterTable
ALTER TABLE "_HomesteadDecorationToHomesteadDecorationCategory" ADD CONSTRAINT "_HomesteadDecorationToHomesteadDecorationCategory_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_HomesteadDecorationToHomesteadDecorationCategory_AB_unique";

-- AlterTable
ALTER TABLE "_ItemToSkin" ADD CONSTRAINT "_ItemToSkin_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ItemToSkin_AB_unique";

-- AlterTable
ALTER TABLE "_bits_item" ADD CONSTRAINT "_bits_item_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_bits_item_AB_unique";

-- AlterTable
ALTER TABLE "_bits_mini" ADD CONSTRAINT "_bits_mini_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_bits_mini_AB_unique";

-- AlterTable
ALTER TABLE "_bits_skin" ADD CONSTRAINT "_bits_skin_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_bits_skin_AB_unique";

-- AlterTable
ALTER TABLE "_prerequisites" ADD CONSTRAINT "_prerequisites_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_prerequisites_AB_unique";

-- AlterTable
ALTER TABLE "_rewards_item" ADD CONSTRAINT "_rewards_item_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_rewards_item_AB_unique";

-- AlterTable
ALTER TABLE "_rewards_title" ADD CONSTRAINT "_rewards_title_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_rewards_title_AB_unique";

-- AlterTable
ALTER TABLE "_suffix" ADD CONSTRAINT "_suffix_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_suffix_AB_unique";

-- AlterTable
ALTER TABLE "_unlock" ADD CONSTRAINT "_unlock_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_unlock_AB_unique";

-- AlterTable
ALTER TABLE "_unlocks_color" ADD CONSTRAINT "_unlocks_color_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_unlocks_color_AB_unique";

-- AlterTable
ALTER TABLE "_unlocks_guild_upgrade" ADD CONSTRAINT "_unlocks_guild_upgrade_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_unlocks_guild_upgrade_AB_unique";

-- AlterTable
ALTER TABLE "_unlocks_recipe" ADD CONSTRAINT "_unlocks_recipe_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_unlocks_recipe_AB_unique";
