-- CreateTable
CREATE TABLE "VendorNpc" (
    "id" TEXT NOT NULL,
    "name_de" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_es" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,

    CONSTRAINT "VendorNpc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorTab" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "name_de" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_es" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "dailyPurchaseLimit" INTEGER,
    "rotation" BOOLEAN NOT NULL,
    "requiresItemId" INTEGER,
    "requiresAchievementId" INTEGER,
    "unlock_de" TEXT,
    "unlock_en" TEXT,
    "unlock_es" TEXT,
    "unlock_fr" TEXT,

    CONSTRAINT "VendorTab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorOffer" (
    "id" TEXT NOT NULL,
    "vendorTabId" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "dailyPurchaseLimit" INTEGER,
    "weeklyPurchaseLimit" INTEGER,
    "characterPurchaseLimit" INTEGER,
    "accountPurchaseLimit" INTEGER,
    "requiresItemId" INTEGER,
    "requiresAchievementId" INTEGER,
    "unlock_de" TEXT,
    "unlock_en" TEXT,
    "unlock_es" TEXT,
    "unlock_fr" TEXT,

    CONSTRAINT "VendorOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorCost" (
    "id" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "itemId" INTEGER,
    "currencyId" INTEGER,

    CONSTRAINT "VendorCost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_vendorItem" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_vendorNpc" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_vendorItem_AB_unique" ON "_vendorItem"("A", "B");

-- CreateIndex
CREATE INDEX "_vendorItem_B_index" ON "_vendorItem"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_vendorNpc_AB_unique" ON "_vendorNpc"("A", "B");

-- CreateIndex
CREATE INDEX "_vendorNpc_B_index" ON "_vendorNpc"("B");

-- AddForeignKey
ALTER TABLE "VendorTab" ADD CONSTRAINT "VendorTab_requiresItemId_fkey" FOREIGN KEY ("requiresItemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTab" ADD CONSTRAINT "VendorTab_requiresAchievementId_fkey" FOREIGN KEY ("requiresAchievementId") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTab" ADD CONSTRAINT "VendorTab_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorOffer" ADD CONSTRAINT "VendorOffer_requiresItemId_fkey" FOREIGN KEY ("requiresItemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorOffer" ADD CONSTRAINT "VendorOffer_requiresAchievementId_fkey" FOREIGN KEY ("requiresAchievementId") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorOffer" ADD CONSTRAINT "VendorOffer_vendorTabId_fkey" FOREIGN KEY ("vendorTabId") REFERENCES "VendorTab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorOffer" ADD CONSTRAINT "VendorOffer_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorCost" ADD CONSTRAINT "VendorCost_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "VendorOffer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorCost" ADD CONSTRAINT "VendorCost_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorCost" ADD CONSTRAINT "VendorCost_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_vendorItem" ADD CONSTRAINT "_vendorItem_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_vendorItem" ADD CONSTRAINT "_vendorItem_B_fkey" FOREIGN KEY ("B") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_vendorNpc" ADD CONSTRAINT "_vendorNpc_A_fkey" FOREIGN KEY ("A") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_vendorNpc" ADD CONSTRAINT "_vendorNpc_B_fkey" FOREIGN KEY ("B") REFERENCES "VendorNpc"("id") ON DELETE CASCADE ON UPDATE CASCADE;
