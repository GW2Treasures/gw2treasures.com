#!/bin/sh

envsubst \$SELF,\$TRUSTED_ORIGINS < /usr/src/template/storage.html > /usr/share/nginx/html/storage.html
envsubst \$SELF,\$TRUSTED_ORIGINS < /usr/src/template/storage.js > /usr/share/nginx/html/storage.js

exec "$@"
