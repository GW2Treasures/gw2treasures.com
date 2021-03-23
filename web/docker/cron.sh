#!/bin/sh

set -ex

PHP_OPTS="-dmemory_limit=-1"

php $PHP_OPTS artisan gw2treasures:achievements -u
php $PHP_OPTS artisan gw2treasures:colors -u
php $PHP_OPTS artisan gw2treasures:events -u
php $PHP_OPTS artisan gw2treasures:items
php $PHP_OPTS artisan gw2treasures:materials -u
php $PHP_OPTS artisan gw2treasures:minis -u
php $PHP_OPTS artisan gw2treasures:mounts -u
php $PHP_OPTS artisan gw2treasures:novelties -u
php $PHP_OPTS artisan gw2treasures:professions -u
php $PHP_OPTS artisan gw2treasures:removed-items
php $PHP_OPTS artisan gw2treasures:skills -u
php $PHP_OPTS artisan gw2treasures:skins -u
php $PHP_OPTS artisan gw2treasures:specializations -u
php $PHP_OPTS artisan gw2treasures:titles -u
php $PHP_OPTS artisan gw2treasures:traits -u
php $PHP_OPTS artisan gw2treasures:worlds -u
