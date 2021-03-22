#!/bin/sh
set -e

echo "=== gw2treasures ==="

php artisan list

# start maintenance
php artisan down

# optimize
php artisan optimize

# wait for db
CONNECT="try{\$d=new PDO('mysql:host=$GW2T_DB_HOST;dbname=$GW2T_DB_NAME','$GW2T_DB_USER','$GW2T_DB_PASS');}catch(Exception \$e){die(1);}"

while ! php -r "$CONNECT"; do
    echo "Waiting for db"
    sleep 1
done

echo "db available"

# check if migrations table exists
#if php -r "$CONNECT try{\$d->query('select 1 from migrations');}catch(Exception \$e){die(1);}"; then
#    echo "migrations table exists"
#else
#    echo "migrations table doesn't exist"
#fi

# run migrations
php artisan migrate --force

php artisan up

exec docker-php-entrypoint "$@"