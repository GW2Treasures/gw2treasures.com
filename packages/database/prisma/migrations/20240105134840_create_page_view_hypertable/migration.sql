-- CreateTable
CREATE TABLE "PageView" (
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "page" TEXT NOT NULL,
    "pageId" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "PageView_time_page_pageId_key" ON "PageView"("time", "page", "pageId");

-- create hypertable
SELECT create_hypertable('"PageView"', by_range('time'));

-- create continuous aggregate 
CREATE MATERIALIZED VIEW "PageView_daily"
WITH (timescaledb.continuous, timescaledb.materialized_only = false) AS
SELECT time_bucket(INTERVAL '1 day', time) AS bucket,
   "page",
   "pageId",
   COUNT(*) AS count
FROM "PageView"
GROUP BY "page", "pageId", bucket
WITH NO DATA;
