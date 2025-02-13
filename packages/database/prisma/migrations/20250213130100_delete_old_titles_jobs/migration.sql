-- remove outdated cron jobs
DELETE FROM "Job" WHERE "type" IN ('titles.check', 'titles.update', 'titles.migrate') AND "cron" IS NOT NULL;
