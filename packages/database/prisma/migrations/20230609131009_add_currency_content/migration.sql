-- CreateTable
CREATE TABLE "CurrencyContent" (
    "containerItemId" INTEGER NOT NULL,
    "currencyId" INTEGER NOT NULL,
    "min" INTEGER NOT NULL,
    "max" INTEGER NOT NULL,

    CONSTRAINT "CurrencyContent_pkey" PRIMARY KEY ("containerItemId","currencyId")
);

-- AddForeignKey
ALTER TABLE "CurrencyContent" ADD CONSTRAINT "CurrencyContent_containerItemId_fkey" FOREIGN KEY ("containerItemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrencyContent" ADD CONSTRAINT "CurrencyContent_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
