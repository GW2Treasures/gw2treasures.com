-- CreateTable
CREATE TABLE "TradingPostHistory" (
    "itemId" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "buyQuantity" INTEGER,
    "buyPrice" INTEGER,
    "sellQuantity" INTEGER,
    "sellPrice" INTEGER
);

-- CreateIndex
CREATE UNIQUE INDEX "TradingPostHistory_itemId_time_key" ON "TradingPostHistory"("itemId", "time");
