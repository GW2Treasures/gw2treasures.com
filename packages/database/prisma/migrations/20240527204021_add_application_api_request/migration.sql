-- CreateTable
CREATE TABLE "ApplicationApiRequest" (
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applicationId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationApiRequest_time_applicationId_endpoint_key" ON "ApplicationApiRequest"("time", "applicationId", "endpoint");

-- AddForeignKey
ALTER TABLE "ApplicationApiRequest" ADD CONSTRAINT "ApplicationApiRequest_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- create hypertable
SELECT create_hypertable('"ApplicationApiRequest"', by_range('time'));
