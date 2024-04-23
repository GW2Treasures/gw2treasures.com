-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "page" TEXT NOT NULL,
    "pageId" INTEGER,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageViewHistory" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "count" INTEGER NOT NULL,
    "page" TEXT NOT NULL,
    "pageId" INTEGER,

    CONSTRAINT "PageViewHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PageView_timestamp_page_pageId_idx" ON "PageView"("timestamp", "page", "pageId");

-- CreateIndex
CREATE INDEX "PageViewHistory_date_page_pageId_idx" ON "PageViewHistory"("date", "page", "pageId");
