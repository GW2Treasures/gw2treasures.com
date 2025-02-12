-- remove outdated cron jobs
DELETE FROM "Job" WHERE "type" IN ('skins.check', 'skins.update', 'skins.migrate') AND "cron" IS NOT NULL;
