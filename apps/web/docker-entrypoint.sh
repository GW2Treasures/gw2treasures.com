#!/bin/sh
set -e

echo "=== Running migrations ==="
npx prisma migrate deploy

echo "=== Starting server ==="
exec "$@"
