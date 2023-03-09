-- CreateTable
CREATE TABLE "ApiRequest" (
    "id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "queryParameters" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "statusText" TEXT NOT NULL,
    "responseTimeMs" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiRequest_pkey" PRIMARY KEY ("id")
);
