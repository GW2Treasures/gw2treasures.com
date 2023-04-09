#!/bin/sh
set -e

echo "=== Running migrations ==="
npx prisma migrate deploy --schema node_modules/.prisma/client/schema.prisma

echo "=== Starting server ==="
exec "$@"
