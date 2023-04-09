<?php

return array(
    'dsn' => $_ENV['SENTRY_DSN'],

    // Capture bindings on SQL queries
    'breadcrumbs.sql_bindings' => true,

    // Capture default user context
    'user_context' => false,
);
