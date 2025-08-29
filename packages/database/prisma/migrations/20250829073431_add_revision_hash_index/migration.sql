-- CreateIndex
CREATE INDEX "Revision_hash_idx" ON "public"."Revision" USING HASH ("hash");
