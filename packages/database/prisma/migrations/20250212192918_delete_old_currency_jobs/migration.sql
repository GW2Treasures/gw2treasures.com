-- remove outdated cron jobs
DELETE FROM "Job" WHERE "type" IN ('currencies.check', 'currencies.update', 'currencies.migrate') AND "cron" IS NOT NULL;
