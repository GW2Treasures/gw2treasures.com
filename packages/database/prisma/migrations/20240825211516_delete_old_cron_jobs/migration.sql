UPDATE "Job" SET "cron" = NULL WHERE "type" IN ('achievements.check', 'achievements.migrate', 'achievements.update');
