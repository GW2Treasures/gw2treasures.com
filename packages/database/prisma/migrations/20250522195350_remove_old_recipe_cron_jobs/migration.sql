UPDATE "Job" SET "cron" = NULL WHERE "type" IN ('recipes.check', 'recipes.migrate', 'recipes.update');
